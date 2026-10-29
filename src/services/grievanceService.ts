import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Grievance, GrievanceStatus } from '../types/civic';
import { INITIAL_SAMPLE_GRIEVANCES } from '../data/seedData';

const COLLECTION_NAME = 'grievances';

export function normalizeReferenceNumber(ref: string): string {
  return ref.trim().toUpperCase();
}

/**
 * Fetch a single grievance by its unique reference number.
 * Note: Under Firestore security rules, only the owner citizen or an authorized admin can read this.
 */
export async function fetchGrievanceByRef(refId: string): Promise<Grievance | null> {
  const normalizedId = normalizeReferenceNumber(refId);
  const docRef = doc(db, COLLECTION_NAME, normalizedId);

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      return null;
    }
    return snapshot.data() as Grievance;
  } catch (error: any) {
    if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
      handleFirestoreError(error, OperationType.GET, `${COLLECTION_NAME}/${normalizedId}`);
    }
    console.error('Error fetching grievance by ref:', error);
    throw error;
  }
}

/**
 * Fetch all grievances owned by the specified citizen UID.
 */
export async function fetchCitizenGrievances(ownerUid: string): Promise<Grievance[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('ownerUid', '==', ownerUid)
    );
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((docSnap) => docSnap.data() as Grievance);
    // Sort client-side by createdAt descending to avoid requiring composite indexes
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Recursively cleanses an object by omitting any keys whose values are `undefined`.
 * Firestore SDK throws InvalidArgumentError if any property is `undefined`.
 */
export function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    if (data instanceof Date) return data;
    const cleaned: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined) {
        cleaned[key] = sanitizeForFirestore(val);
      }
    }
    return cleaned as T;
  }
  return data;
}

/**
 * Fetch all grievances for admin view.
 * Requires admin authorization in Firestore rules.
 */
export async function fetchAllGrievancesAdmin(): Promise<Grievance[]> {
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    const list = snapshot.docs.map((docSnap) => docSnap.data() as Grievance);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
  }
}

/**
 * Create a new grievance in Firestore.
 * Fails if Firestore write is rejected or times out.
 */
export async function createGrievanceInFirestore(grievance: Grievance, timeoutMs = 15000): Promise<void> {
  const cleanData = sanitizeForFirestore(grievance);
  const docRef = doc(db, COLLECTION_NAME, cleanData.id);
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              `Cloud Firestore write timed out after ${timeoutMs / 1000} seconds. Please check your network connection and Firestore access.`
            )
          ),
        timeoutMs
      )
    );
    await Promise.race([setDoc(docRef, cleanData), timeoutPromise]);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTION_NAME}/${grievance.id}`);
  }
}

/**
 * Update the status of a grievance (Admin action).
 */
export async function updateGrievanceStatusInFirestore(
  refId: string,
  newStatus: GrievanceStatus,
  remarks: string,
  actorName: string
): Promise<void> {
  const normalizedId = normalizeReferenceNumber(refId);
  const docRef = doc(db, COLLECTION_NAME, normalizedId);

  try {
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) {
      throw new Error(`Grievance ${normalizedId} not found.`);
    }

    const current = snapshot.data() as Grievance;
    const now = new Date().toISOString();

    const newTimelineEntry = {
      id: 'tl-' + Date.now(),
      status: newStatus,
      title: `Status Updated to ${newStatus}`,
      description: remarks || `Status updated to ${newStatus} by ${actorName}.`,
      timestamp: now,
      actor: actorName,
    };

    const updatePayload: Partial<Grievance> = {
      status: newStatus,
      updatedAt: now,
      timeline: [...current.timeline, newTimelineEntry],
    };

    if (newStatus === 'Resolved') {
      updatePayload.resolutionRemarks = remarks;
    }

    const cleanUpdate = sanitizeForFirestore(updatePayload);
    await updateDoc(docRef, cleanUpdate);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${normalizedId}`);
  }
}

/**
 * Citizen feedback submission on a resolved grievance.
 */
export async function submitFeedbackInFirestore(
  refId: string,
  rating: number,
  remarks: string
): Promise<void> {
  const normalizedId = normalizeReferenceNumber(refId);
  const docRef = doc(db, COLLECTION_NAME, normalizedId);

  try {
    const updatePayload = {
      feedbackRating: rating,
      feedbackRemarks: remarks.trim(),
      updatedAt: new Date().toISOString(),
    };
    const cleanUpdate = sanitizeForFirestore(updatePayload);
    await updateDoc(docRef, cleanUpdate);
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${normalizedId}`);
  }
}

/**
 * Helper to seed sample grievances for the signed-in user so they can immediately test tracking.
 */
export async function seedInitialGrievancesForUser(
  userUid: string,
  citizenName: string,
  citizenEmail: string
): Promise<number> {
  let seededCount = 0;
  for (const sample of INITIAL_SAMPLE_GRIEVANCES) {
    try {
      const docRef = doc(db, COLLECTION_NAME, sample.id);
      const existing = await getDoc(docRef);
      if (!existing.exists()) {
        const userSample: Grievance = {
          ...sample,
          ownerUid: userUid,
          citizenName: citizenName || sample.citizenName,
          citizenEmail: citizenEmail || sample.citizenEmail,
        };
        const cleanSample = sanitizeForFirestore(userSample);
        await setDoc(docRef, cleanSample);
        seededCount++;
      }
    } catch (e) {
      console.warn(`Could not seed ${sample.id}:`, e);
    }
  }
  return seededCount;
}
