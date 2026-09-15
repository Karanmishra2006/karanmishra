import React, { useState, useEffect } from 'react';
import { User, Menu, X, MapPin, Globe, Shield, ChevronRight } from 'lucide-react';
import { AppView, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { IndiaSchemeMap } from './IndiaSchemeMap';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onStartEligibility: () => void;
  onOpenQuickInfo?: () => void;
}

export const EMBLEM_URL = '/emblem.svg';

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  language,
  onToggleLanguage,
  onStartEligibility,
  onOpenQuickInfo
}) => {
  const [showMap, setShowMap] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];

  const [scrollY, setScrollY] = useState(0);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#fbf9f3]/95 backdrop-blur-md border-b border-[#c3c6ce]/30 shadow-xs">
        <div className="h-11 md:h-12 w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('landing');
              }}
              className="flex items-center gap-2 cursor-pointer group text-left shrink-0"
              aria-label="SchemeSetu Home"
            >
              <img
                alt="SchemeSetu Emblem"
                className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0 transition-transform group-hover:scale-105"
                src={EMBLEM_URL}
              />
              <div className="flex items-baseline font-bold text-base md:text-lg tracking-tight">
                <span className="text-[#16324F]">Scheme</span>
                <span className="text-[#C0392B]">Setu</span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            <button
              type="button"
              onClick={() => {
                if (currentView !== 'landing') onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className={`text-xs md:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                currentView === 'landing' ? 'text-[#16324F]' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
            >
              {t.howItWorks}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('schemes')}
              className={`text-xs md:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                currentView === 'schemes' ? 'text-[#C0392B] underline font-bold' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
            >
              {t.schemeRepo}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('transparency')}
              className={`text-xs md:text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                currentView === 'transparency' ? 'text-[#C0392B] underline font-bold' : 'text-[#43474d] hover:text-[#C0392B]'
              }`}
            >
              {t.transparency}
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentView !== 'landing') onNavigate('landing');
                setTimeout(() => {
                  const el = document.getElementById('about');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-xs md:text-sm font-semibold text-[#43474d] hover:text-[#C0392B] transition-colors duration-200 cursor-pointer"
            >
              {t.about}
            </button>
          </nav>

          {/* Desktop Action Controls & Language Switcher (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Language Switcher */}
            <div className="flex items-center px-2 py-0.5 rounded-lg bg-[#f0eee8] border border-[#c3c6ce]/40 text-[#43474d] text-[11px] font-bold tracking-wider uppercase">
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`transition-colors cursor-pointer ${
                  language === 'en' ? 'text-[#16324F] font-extrabold' : 'hover:text-[#C0392B]'
                }`}
              >
                EN
              </button>
              <span className="mx-1.5 text-[#c3c6ce]">/</span>
              <button
                type="button"
                onClick={() => onToggleLanguage('hi')}
                className={`transition-colors cursor-pointer ${
                  language === 'hi' ? 'text-[#C0392B] font-extrabold' : 'hover:text-[#C0392B]'
                }`}
              >
                हिंदी
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowMap(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16324f] text-white text-xs font-semibold hover:bg-[#10243a] transition-all shadow-xs cursor-pointer"
            >
              <span>Scheme Map</span>
            </button>

            {/* User / Profile Info Indicator */}
            <button
              type="button"
              onClick={onOpenQuickInfo}
              title="Citizen Session & Privacy Status"
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#eae8e2] border border-[#c3c6ce]/40 flex items-center justify-center text-[#16324F] hover:bg-[#e4e2dd] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden flex items-center justify-center w-10 h-10 -mr-1 rounded-lg text-[#16324F] hover:bg-[#f0eee8] active:bg-[#eae8e2] active:scale-95 transition-all duration-150 ease-out cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 transition-transform duration-150" />
            ) : (
              <Menu className="w-6 h-6 transition-transform duration-150" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#c3c6ce]/30 bg-[#fbf9f3] px-4 py-4 space-y-3 shadow-lg max-h-[calc(100vh-60px)] overflow-y-auto">
            {/* Primary Nav Links */}
            <nav className="space-y-1.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => {
                    const el = document.getElementById('how-it-works');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className={`mobile-nav-item flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg text-sm font-semibold text-left cursor-pointer ${
                  currentView === 'landing'
                    ? 'bg-[#16324F]/10 text-[#16324F] font-bold'
                    : 'text-[#1b1c18]'
                }`}
              >
                <span>{t.howItWorks}</span>
                <ChevronRight className="w-4 h-4 text-[#74777e] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('schemes');
                }}
                className={`mobile-nav-item flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg text-sm font-semibold text-left cursor-pointer ${
                  currentView === 'schemes'
                    ? 'bg-[#16324F]/10 text-[#16324F] font-bold'
                    : 'text-[#1b1c18]'
                }`}
              >
                <span>{t.schemeRepo}</span>
                <ChevronRight className="w-4 h-4 text-[#74777e] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('transparency');
                }}
                className={`mobile-nav-item flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg text-sm font-semibold text-left cursor-pointer ${
                  currentView === 'transparency'
                    ? 'bg-[#16324F]/10 text-[#16324F] font-bold'
                    : 'text-[#1b1c18]'
                }`}
              >
                <span>{t.transparency}</span>
                <ChevronRight className="w-4 h-4 text-[#74777e] shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentView !== 'landing') onNavigate('landing');
                  setTimeout(() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="mobile-nav-item flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg text-sm font-semibold text-[#1b1c18] text-left cursor-pointer"
              >
                <span>{t.about}</span>
                <ChevronRight className="w-4 h-4 text-[#74777e] shrink-0" />
              </button>
            </nav>

            {/* Scheme Map Button in Mobile Menu */}
            <div className="pt-2 border-t border-[#c3c6ce]/30 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowMap(true);
                }}
                className="group flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg bg-[#16324f] text-white text-sm font-semibold shadow-xs hover:bg-[#10243a] hover:translate-x-[3px] hover:shadow-md active:bg-[#0c1c2d] active:translate-x-[2px] active:scale-[0.99] active:shadow-sm transition-all duration-200 ease-out cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 transition-transform duration-200 ease-out group-hover:scale-110" />
                  <span>Scheme Map</span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 group-active:translate-x-1 transition-all duration-200 ease-out shrink-0" />
              </button>

              {/* Language Switcher in Mobile Menu */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-[#f0eee8] text-xs font-semibold text-[#43474d]">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-[#74777e]" />
                  <span>Language / भाषा</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onToggleLanguage('en')}
                    className={`px-2.5 py-1 rounded transition-all duration-150 cursor-pointer active:scale-95 ${
                      language === 'en'
                        ? 'bg-white text-[#16324F] font-bold shadow-xs'
                        : 'text-[#43474d] hover:text-[#16324F] hover:bg-white/60'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleLanguage('hi')}
                    className={`px-2.5 py-1 rounded transition-all duration-150 cursor-pointer active:scale-95 ${
                      language === 'hi'
                        ? 'bg-white text-[#C0392B] font-bold shadow-xs'
                        : 'text-[#43474d] hover:text-[#C0392B] hover:bg-white/60'
                    }`}
                  >
                    हिंदी
                  </button>
                </div>
              </div>

              {/* Citizen Session Status */}
              {onOpenQuickInfo && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuickInfo();
                  }}
                  className="group flex items-center justify-between w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold text-[#16324F] bg-[#f0eee8] hover:bg-[#eae8e2] hover:translate-x-[3px] hover:shadow-xs active:bg-[#e4e2dc] active:translate-x-[2px] active:scale-[0.99] transition-all duration-200 ease-out text-left cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#2F6B4F]" />
                    <span>Citizen Privacy &amp; Session</span>
                  </span>
                  <User className="w-4 h-4 text-[#16324F] group-hover:translate-x-0.5 transition-transform duration-200 ease-out" />
                </button>
              )}

              {/* Start Eligibility CTA */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartEligibility();
                }}
                className="group flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-lg bg-[#C0392B] text-white text-sm font-bold shadow-xs hover:bg-[#a93226] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:bg-[#962d22] active:scale-[0.99] active:shadow-xs transition-all duration-200 ease-out text-center cursor-pointer"
              >
                <span>Check Eligibility Now</span>
                <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1 group-active:translate-x-1">→</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {showMap && (
        <div
          className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowMap(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[92vh] overflow-y-auto p-3.5 sm:p-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
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
              className="w-full mt-3 sm:mt-4 py-3 rounded-lg bg-[#16324f] text-white text-sm font-semibold hover:bg-[#10243a] transition-all cursor-pointer"
            >
              Check your eligibility →
            </button>
          </div>
        </div>
      )}
    </>
  );
};
