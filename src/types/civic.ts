export type GrievanceCategory =
  | 'Roads & Infrastructure'
  | 'Water Supply & Drainage'
  | 'Electricity & Power'
  | 'Waste & Sanitation'
  | 'Public Health & Safety'
  | 'Civic Certificates & Welfare';

export type GrievancePriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export type GrievanceStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Rejected';

export interface PublicService {
  id: string;
  title: string;
  department: string;
  ministry: string;
  category: GrievanceCategory;
  description: string;
  slaDays: number;
  slaDescription: string;
  helpline: string;
  requiredDocs: string[];
  processSteps: string[];
  officialPortal: string;
  tags: string[];
  reviewDate: string;
  source: string;
}

export interface TimelineEntry {
  id: string;
  status: GrievanceStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface AssignedOfficer {
  name: string;
  designation: string;
  department: string;
  phone: string;
}

export interface Grievance {
  id: string; // e.g. CA-2026-7841
  ownerUid: string; // Firebase Auth UID of the citizen
  subject: string;
  description: string;
  category: GrievanceCategory;
  department: string;
  area: string; // Ward / locality
  city: string;
  pincode: string;
  landmark?: string;
  priority: GrievancePriority;
  status: GrievanceStatus;
  citizenName: string;
  citizenPhone: string;
  citizenEmail: string;
  attachmentName?: string;
  attachmentData?: string; // base64 preview or placeholder
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  estimatedResolutionDate: string;
  assignedOfficer?: AssignedOfficer;
  timeline: TimelineEntry[];
  resolutionRemarks?: string;
  feedbackRating?: number;
  feedbackRemarks?: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
  reviewDate?: string;
  suggestedAction?: {
    label: string;
    category?: GrievanceCategory;
    department?: string;
    targetTab?: string;
  };
}
