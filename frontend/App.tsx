/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  AppView,
  Language,
  Scheme,
  SchemeEligibilityResult,
  UserProfile
} from './types';

import { Header } from './components/Header';
import { LandingView } from './components/LandingView';
import { EligibilityFlow } from './components/EligibilityFlow';
import { ResultsView } from './components/ResultsView';
import { RepositoryView } from './components/RepositoryView';
import { TransparencyView } from './components/TransparencyView';
import { SchemeModal } from './components/SchemeModal';
import { CitizenInfoModal } from './components/CitizenInfoModal';
import { Footer } from './components/Footer';

import { evaluateEligibility } from './utils/rulesEngine';

export const INITIAL_PROFILE: UserProfile = {
  supportGoal: 'New Business',
  projectCost: 1000000,
  familyIncome: 350000,
  age: 29,
  gender: 'Female',
  priorityCategory: 'Yes',
  state: 'Maharashtra',
  district: 'Pune',
  locationType: 'Rural',
  socialCategory: 'OBC',
  occupation: 'Aspiring Entrepreneur',
  businessType: 'Manufacturing',
  businessStage: 'New',
  turnover: 0
};

export default function App() {
  const [currentView, setCurrentView] =
    useState<AppView>('landing');

  const [language, setLanguage] =
    useState<Language>('en');

  const [profile, setProfile] =
    useState<UserProfile>(INITIAL_PROFILE);

  // Schemes coming from MongoDB
  const [schemes, setSchemes] =
    useState<Scheme[]>([]);

  const [isSchemesLoading, setIsSchemesLoading] =
    useState<boolean>(true);

  const [matches, setMatches] =
    useState<SchemeEligibilityResult[]>([]);

  const [selectedScheme, setSelectedScheme] =
    useState<Scheme | null>(null);

  const [isCitizenModalOpen, setIsCitizenModalOpen] =
    useState<boolean>(false);

  const [isEvaluating, setIsEvaluating] =
    useState<boolean>(false);

  // ==========================================
  // FETCH SCHEMES FROM MONGODB
  // ==========================================

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setIsSchemesLoading(true);

        const response = await fetch('https://karanmishra.onrender.com/api/schemes')

        if (!response.ok) {
          throw new Error(
            `API request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || 'Failed to fetch schemes'
          );
        }

        setSchemes(result.data);

        // Do NOT pre-evaluate with INITIAL_PROFILE — evaluation runs only when
        // the user explicitly submits after filling the questionnaire.
        console.log(
          `Loaded ${result.data.length} schemes from MongoDB`
        );
      } catch (error) {
        console.error(
          'Failed to load schemes from MongoDB:',
          error
        );
      } finally {
        setIsSchemesLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigate = (view: AppView) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setCurrentView(view);
  };

  const handleStartEligibility = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setCurrentView('flow');
  };

  // ==========================================
  // ELIGIBILITY SUBMISSION
  // ==========================================

  const handleSubmitEvaluation = () => {
    if (schemes.length === 0) {
      console.error(
        'No schemes available for eligibility evaluation.'
      );
      return;
    }

    setIsEvaluating(true);
    setCurrentView('results');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

    const delay = prefersReducedMotion ? 400 : 1600;

    setTimeout(() => {
      const results = evaluateEligibility(
        profile,
        schemes
      );

      setMatches(results);
      setIsEvaluating(false);
    }, delay);
  };

  // ==========================================
  // RESET SESSION
  // ==========================================

  const handleResetSession = () => {
    setProfile(INITIAL_PROFILE);
    // Clear results — user must re-submit the form to get new results
    setMatches([]);
    setIsCitizenModalOpen(false);
  };

  // ==========================================
  // APP UI
  // ==========================================

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f3] text-[#1b1c18]">

      {/* Top Fixed Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        language={language}
        onToggleLanguage={setLanguage}
        onStartEligibility={handleStartEligibility}
        onOpenQuickInfo={() =>
          setIsCitizenModalOpen(true)
        }
      />

      {/* Main Viewport Body */}
      <main className="flex-1 w-full pt-11 md:pt-12">

        {/* LANDING */}
        {currentView === 'landing' && (
          <LandingView
            language={language}
            onStartEligibility={
              handleStartEligibility
            }
            onNavigateToTransparency={() =>
              handleNavigate('transparency')
            }
            onNavigate={handleNavigate}
            onToggleLanguage={setLanguage}
            onOpenQuickInfo={() =>
              setIsCitizenModalOpen(true)
            }
          />
        )}

        {/* ELIGIBILITY FLOW */}
        {currentView === 'flow' && (
          <>
            {isSchemesLoading ? (
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-[#16324F]/30 border-t-[#16324F] rounded-full animate-spin mx-auto mb-3" />

                  <h3 className="text-base font-bold text-[#001d37]">
                    Loading government schemes...
                  </h3>

                  <p className="text-xs text-[#43474d] mt-1">
                    Connecting to SchemeSetu database.
                  </p>
                </div>
              </div>
            ) : (
              <EligibilityFlow
                profile={profile}
                isEvaluating={isEvaluating}
                onChangeProfile={setProfile}
                onBackToHome={() =>
                  handleNavigate('landing')
                }
                onSubmitEvaluation={
                  handleSubmitEvaluation
                }
              />
            )}
          </>
        )}

        {/* RESULTS */}
        {currentView === 'results' && (
          <ResultsView
            matches={matches}
            profile={profile}
            isEvaluating={isEvaluating}
            onModifyProfile={() =>
              handleNavigate('flow')
            }
            onReturnHome={() =>
              handleNavigate('landing')
            }
            onOpenSchemeModal={setSelectedScheme}
          />
        )}

        {/* SCHEME REPOSITORY */}
        {currentView === 'schemes' && (
          <RepositoryView
            onStartEligibility={
              handleStartEligibility
            }
            onOpenSchemeModal={setSelectedScheme}
          />
        )}

        {/* TRANSPARENCY */}
        {currentView === 'transparency' && (
          <TransparencyView
            onStartEligibility={
              handleStartEligibility
            }
          />
        )}
      </main>

      {/* Persistent Civic Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Scheme Detail Modal */}
      <SchemeModal
        scheme={selectedScheme}
        onClose={() =>
          setSelectedScheme(null)
        }
      />

      {/* Citizen Session & Privacy Modal */}
      <CitizenInfoModal
        isOpen={isCitizenModalOpen}
        onClose={() =>
          setIsCitizenModalOpen(false)
        }
        profile={profile}
        onResetSession={handleResetSession}
        onStartEvaluation={
          handleStartEligibility
        }
      />
    </div>
  );
}