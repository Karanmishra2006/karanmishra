import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowRight,
  Target,
  ShieldCheck,
  Users,
  ArrowDown,
  Folder,
  FileText,
  Database,
  User,
  MapPin,
  Menu,
  X,
  ChevronRight,
  Globe,
  Award
} from 'lucide-react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { EMBLEM_URL } from './Header';
import { IndiaSchemeMap } from './IndiaSchemeMap';

interface LandingViewProps {
  language: Language;
  onStartEligibility: () => void;
  onNavigateToTransparency: () => void;
  onNavigate?: (view: AppView) => void;
  onToggleLanguage?: (lang: Language) => void;
  onOpenQuickInfo?: () => void;
}

const KEYWORD_PHRASES = [
  'Discover your benefits.',
  'Check your eligibility.',
  'Know your schemes.',
  'Claim your subsidies.'
];

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onStartEligibility,
  onNavigateToTransparency,
  onNavigate,
  onToggleLanguage,
  onOpenQuickInfo
}) => {
  const t = TRANSLATIONS[language];
  const [showMap, setShowMap] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-typing and keyword changing effect
  const [textIndex, setTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState(KEYWORD_PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  // Flow chart 1-box rotation effect
  const [activeStep, setActiveStep] = useState<number>(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 3800);

    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const targetPhrase = KEYWORD_PHRASES[textIndex];
    const typingSpeed = isDeleting ? 38 : 70;

    if (!isDeleting && currentText === targetPhrase) {
      const pauseTimer = setTimeout(() => {
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(pauseTimer);
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % KEYWORD_PHRASES.length);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentText((prev) =>
        isDeleting
          ? targetPhrase.substring(0, prev.length - 1)
          : targetPhrase.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, textIndex]);

  return (
    <div className="flex flex-col w-full bg-[#fbf9f3]" id="landing-view">
      {/* ═══════════════════════════════════════════════════════
          HERO: PALE WHITE BORDER EXTENDING TILL WEBSITE EDGES
          - Pale white #fbf9f3 matching complete page
          - Extends to 100% website width (no outer gap/margins)
          - No shadow
          - Large rounded inner canvas so image doesn't crop
      ════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#fbf9f3] px-2 sm:px-3 lg:px-4 py-2 sm:py-3 shadow-none border-none">
        {/* ─── DOMINANT CONTINUOUS PALE WHITE FRAME (EXTENDING TILL EDGES) ─── */}
        <div className="relative w-full bg-[#fbf9f3] shadow-none border-none">
          {/* Inner Canvas with rounded corners all around */}
          <div className="relative w-full rounded-[1.8rem] sm:rounded-[2.4rem] lg:rounded-[2.8rem] overflow-hidden min-h-[460px] md:min-h-[500px] lg:min-h-[530px] xl:min-h-[560px] flex flex-col justify-end shadow-xs">
            {/* 5-Person Community Photographic Collage Background - Cropped from top so heads are near top and faces fully visible */}
            <img
              src="/bg-image.png"
              alt="Indian community: farmer, shopkeeper, student, artisan woman, elderly citizen"
              className="absolute inset-0 w-full h-full object-cover object-[center_65%] select-none pointer-events-none"
            />

            {/* Softened Left & Bottom Gradient so Farmer and Shopkeeper Faces are clearly visible */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(8, 14, 26, 0.55) 0%, rgba(8, 14, 26, 0.38) 28%, rgba(8, 14, 26, 0.08) 48%, transparent 65%)'
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(0deg, rgba(8, 14, 26, 0.85) 0%, rgba(8, 14, 26, 0.40) 25%, transparent 55%)'
              }}
            />
            <div
              className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(8, 14, 26, 0.4) 0%, transparent 100%)'
              }}
            />

            {/* ─── MAIN HERO INTERACTION AREA (GRID) - SHIFTED DOWN SO ALL FACES ARE UNOBSTRUCTED ─── */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 items-end px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-5 sm:pb-6 mt-auto">
              {/* LEFT COLUMN: Editorial Hero Messaging, Primary CTA & Small Stats Bar */}
              <div className="lg:col-span-7 flex flex-col justify-end space-y-3 lg:pr-6">
                {/* Main Headline with drop shadow for clarity over background */}
                <div className="space-y-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                  <h1 className="font-extrabold text-white text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] leading-[1.1] tracking-tight m-0">
                    Find the Right Schemes.
                  </h1>
                  <h1 className="font-extrabold text-2xl sm:text-3xl lg:text-[38px] xl:text-[42px] leading-[1.1] tracking-tight m-0 min-h-[1.25em] flex items-center">
                    <span className="text-[#f97316] relative inline-flex items-center">
                      <span>{currentText}</span>
                      <span
                        className="inline-block w-[3px] h-[0.82em] bg-[#f97316] ml-1.5 animate-pulse rounded-full"
                        aria-hidden="true"
                      />
                    </span>
                  </h1>
                  <span
                    className="block h-[3px] w-12 rounded-full bg-[#f97316] mt-0.5"
                    aria-hidden="true"
                  />
                </div>

                {/* Subtitle / Description */}
                <p className="text-white/90 text-sm sm:text-[15px] leading-relaxed max-w-[440px] font-normal drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  SchemeSetu helps users discover relevant government schemes and check their eligibility based on their personal and business details.
                </p>

                {/* Primary CTA and Trust Row */}
                <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-0.5">
                  <button
                    type="button"
                    id="hero-check-eligibility-cta"
                    onClick={onStartEligibility}
                    className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#16324F] hover:bg-[#10243a] text-white text-sm font-bold shadow-lg hover:shadow-xl transition-all border border-white/20 active:scale-[0.98] cursor-pointer group"
                  >
                    <span>Check your eligibility</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </button>

                  <div className="flex items-center gap-2 text-white/90 text-xs font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span>No login required</span>
                    </span>
                    <span className="text-white/40">|</span>
                    <span>Evaluation takes under 2 minutes</span>
                  </div>
                </div>

                {/* Very Small Compact Stats Bar directly below Check Eligibility CTA */}
                <div className="pt-1.5">
                  <div className="inline-flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-white/92 backdrop-blur-md border border-white/70 shadow-md">
                    {/* Stat 1: Schemes */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#16324F]/10 flex items-center justify-center text-[#16324F] shrink-0">
                        <Folder className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#16324F] leading-tight">
                          850+
                        </div>
                        <div className="text-[9px] text-[#43474d] font-semibold leading-none">
                          Central &amp; State Schemes
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-5 bg-[#c3c6ce]/60" />

                    {/* Stat 2: Rules */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shrink-0">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#16324F] leading-tight">
                          42
                        </div>
                        <div className="text-[9px] text-[#43474d] font-semibold leading-none">
                          Deterministic Rules
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:block w-px h-5 bg-[#c3c6ce]/60" />

                    {/* Stat 3: Data */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#45617d]/10 flex items-center justify-center text-[#45617d] shrink-0">
                        <Database className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#16324F] leading-tight">
                          Zero
                        </div>
                        <div className="text-[9px] text-[#43474d] font-semibold leading-none">
                          Data Stored or Shared
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Dynamic 1-Box Step Flow Chart (Changes Automatically) */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center w-full max-w-[430px] mx-auto lg:ml-auto">
                <div className="w-full bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl p-4 sm:p-5 shadow-xl transition-all duration-300">
                  {/* STEP 1: PROFILE INPUT */}
                  {activeStep === 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#16324F] shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                            01 / Profile Input
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Active</span>
                        </span>
                      </div>

                      {/* Profile Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {['Age: 29', 'Female', 'OBC', 'Maharashtra - Rural', 'New Business'].map(
                          (tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-md bg-[#1e293b] text-white text-[11px] font-medium shadow-xs"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: ELIGIBILITY CHECK */}
                  {activeStep === 1 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700 tracking-wider uppercase">
                            02 / Eligibility Check
                          </span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>All checks passed</span>
                        </span>
                      </div>

                      {/* 4 Eligibility Checks */}
                      <div className="space-y-1.5 mb-3">
                        {[
                          'Your age meets the scheme requirement',
                          'Your project cost is within the allowed limit',
                          'Your location qualifies for the scheme',
                          'You qualify for special category benefits'
                        ].map((check, i) => (
                          <div key={i} className="flex items-center justify-between text-left gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="text-[11px] sm:text-[11.5px] text-[#334155] font-medium truncate">
                                {check}
                              </span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-100/90 text-emerald-800 text-[10px] font-bold shrink-0 tracking-wide">
                              PASS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: MATCHED SCHEME */}
                  {activeStep === 2 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="text-base font-bold text-emerald-700">
                            98% match
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                            Central Sector
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <span className="text-[9px]">✓</span> Verified
                          </span>
                        </div>
                      </div>

                      <div className="mt-1 mb-2.5">
                        <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] leading-snug">
                          Prime Minister Employment Generation Programme
                        </h4>
                        <p className="text-[11px] text-[#64748b] font-medium mt-0.5">
                          Ministry of MSME
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[10px] font-semibold">
                            35% capital subsidy
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                            Up to ₹50L
                          </span>
                          <span className="text-slate-500 text-[10px] font-medium px-1">
                            +4 more
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step Switcher Indicator */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {[0, 1, 2].map((step) => (
                        <button
                          key={step}
                          type="button"
                          onClick={() => setActiveStep(step)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            activeStep === step
                              ? 'w-6 bg-[#16324F]'
                              : 'w-2 bg-slate-300 hover:bg-slate-400'
                          }`}
                          aria-label={`Switch to step ${step + 1}`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 font-medium text-[10px]">
                      {activeStep === 0 && 'Step 1 of 3: Applicant Profile'}
                      {activeStep === 1 && 'Step 2 of 3: Deterministic Checks'}
                      {activeStep === 2 && 'Step 3 of 3: Matched Scheme'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Padding Accent within frame */}
            <div className="h-3 w-full" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION: ABOUT SCHEMESETU — CIVIC TECH COMMITMENT
      ════════════════════════════════════════════════════════ */}
      <section id="about" className="w-full pt-12 pb-20 border-t border-[#c3c6ce]/30 bg-[#fbf9f3]">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 max-w-5xl">
            <div className="flex items-center gap-3.5">
              <img
                src={EMBLEM_URL}
                alt="SchemeSetu Emblem"
                className="w-10 h-10 rounded-lg shadow-xs shrink-0 object-contain"
              />
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#16324F] font-bold tracking-tight">
                {t.aboutTitle}
              </h2>
            </div>
            <p className="text-base sm:text-lg text-[#43474d] leading-relaxed">
              {t.aboutDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6 mt-10">
            {/* Mission Card */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-[#16324f]/10 flex items-center justify-center text-[#16324F] mb-2">
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  OUR MISSION
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">
                  {t.missionTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.missionDesc}
                </p>
              </div>
            </div>

            {/* Transparency Card */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  TRANSPARENCY
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">
                  {t.transparencyCardTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.transparencyCardDesc}
                </p>
              </div>
            </div>

            {/* Accessibility Card */}
            <div className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow">
              <div className="space-y-2.5">
                <div className="w-10 h-10 rounded-full bg-[#45617d]/10 flex items-center justify-center text-[#45617d] mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-[#C0392B]">
                  ACCESSIBILITY
                </span>
                <h3 className="text-lg text-[#16324F] font-bold mt-1">
                  {t.accessibilityTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed mt-2">
                  {t.accessibilityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Scheme Coverage Map Modal ─── */}
      {showMap && (
        <div
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowMap(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-bold text-[#001d37]">
                Scheme Coverage Map
              </span>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="w-8 h-8 rounded-full bg-[#f0eee8] flex items-center justify-center text-[#43474d] hover:bg-[#e4e2dd] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
            <IndiaSchemeMap />
            <button
              type="button"
              onClick={() => {
                setShowMap(false);
                onStartEligibility();
              }}
              className="w-full mt-4 py-3 rounded-xl bg-[#16324f] text-white text-sm font-semibold hover:bg-[#10243a] transition-all cursor-pointer shadow-md"
            >
              Check your eligibility →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
