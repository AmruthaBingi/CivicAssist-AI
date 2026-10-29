/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header, NavigationTab } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { ServicesPage } from './components/pages/ServicesPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { SubmitGrievancePage } from './components/pages/SubmitGrievancePage';
import { TrackComplaintPage } from './components/pages/TrackComplaintPage';
import { CitizenDashboardPage } from './components/pages/CitizenDashboardPage';
import { AdminDashboardPage } from './components/pages/AdminDashboardPage';
import { LoginPage } from './components/pages/LoginPage';
import { testFirestoreConnection } from './services/firebase';
import { INITIAL_SAMPLE_GRIEVANCES } from './data/seedData';
import { Grievance, GrievanceCategory } from './types/civic';

function AppContent() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [trackRefId, setTrackRefId] = useState<string>('CA-2026-7841');
  const [submitCategory, setSubmitCategory] = useState<GrievanceCategory | undefined>(undefined);
  const [submitDepartment, setSubmitDepartment] = useState<string | undefined>(undefined);
  const [submitSubject, setSubmitSubject] = useState<string | undefined>(undefined);
  const [loginRedirectTab, setLoginRedirectTab] = useState<NavigationTab>('citizen-dashboard');

  // Verify connection to Firestore on initial boot
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      if (connected) {
        console.log('Successfully connected to Cloud Firestore.');
      }
    });
  }, []);

  const handleNavigate = (tab: NavigationTab, params?: any) => {
    if (params) {
      if (params.refId) {
        setTrackRefId(params.refId);
      }
      if (params.category) {
        setSubmitCategory(params.category);
      }
      if (params.department) {
        setSubmitDepartment(params.department);
      }
      if (params.subjectHint) {
        setSubmitSubject(params.subjectHint);
      }
      if (params.redirectTab) {
        setLoginRedirectTab(params.redirectTab);
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />

      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage onNavigate={handleNavigate} grievances={INITIAL_SAMPLE_GRIEVANCES} />
        )}

        {currentTab === 'services' && (
          <ServicesPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'ai-assistant' && (
          <AIAssistantPage onNavigate={handleNavigate} />
        )}

        {currentTab === 'submit' && (
          <SubmitGrievancePage
            initialCategory={submitCategory}
            initialDepartment={submitDepartment}
            initialSubject={submitSubject}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'track' && (
          <TrackComplaintPage
            initialRefId={trackRefId}
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'citizen-dashboard' && (
          <CitizenDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'admin-dashboard' && (
          <AdminDashboardPage
            onNavigate={handleNavigate}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            redirectTab={loginRedirectTab}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
