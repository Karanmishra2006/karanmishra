import React from 'react';
import { EMBLEM_URL } from './Header';
import { AppView } from '../types';

interface FooterProps {
  onNavigate: (view: AppView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#fbf9f3] px-2 sm:px-3 lg:px-4 pb-2 sm:pb-3 pt-1 sm:pt-2 border-none">
      <div className="w-full bg-[#102336] text-white/80 rounded-[1.8rem] sm:rounded-[2.4rem] lg:rounded-[2.8rem] overflow-hidden px-4 sm:px-6 lg:px-8 py-10 sm:py-12 border border-slate-700/40 shadow-xs">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2">
              <img
                alt="SchemeSetu Emblem"
                className="w-7 h-7 object-contain"
                src={EMBLEM_URL}
              />
              <span className="text-xl tracking-tight text-white font-bold font-heading">
                Scheme<span className="text-[#ffdad5]">Setu</span>
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-sm leading-relaxed">
              Public Digital Infrastructure bridging citizens to statutory benefits via open rules, verifiable mandates, and unified eligibility criteria.
            </p>
            <div className="pt-1">
              <span className="text-[11px] text-white/50 tracking-wider uppercase block font-medium">
                Open Civic Data Initiative · Public Service
              </span>
            </div>
          </div>

          {/* Column 1: Covered Ministries */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs text-white font-bold uppercase tracking-wider mb-2">
              COVERED MINISTRIES
            </div>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of Finance
              </li>
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of Agriculture &amp; Farmers Welfare
              </li>
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of Education
              </li>
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of MSME
              </li>
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of Skill Development
              </li>
              <li
                onClick={() => onNavigate('schemes')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ministry of Rural Development
              </li>
            </ul>
          </div>

          {/* Column 2: Institutional Linkages */}
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs text-white font-bold uppercase tracking-wider mb-2">
              INSTITUTIONAL LINKAGES
            </div>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                National Data &amp; Analytics Platform
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Direct Benefit Transfer (DBT) Bharat
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Open Digital Public Infrastructure
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Gazette Notification Archives
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                State Welfare Directives
              </li>
            </ul>
          </div>

          {/* Column 3: Constitutional Governance */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-xs text-white font-bold uppercase tracking-wider mb-2">
              CONSTITUTIONAL GOVERNANCE
            </div>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Digital Personal Data Protection (DPDP)
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Non-Custodial Eligibility Audits
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Statutory Attribution Standards
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Right to Public Services
              </li>
              <li
                onClick={() => onNavigate('transparency')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Accessibility Statement (GIGW)
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <p className="text-center md:text-left">
            © 2025 SchemeSetu Public Digital Infrastructure. Built for open citizen access.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('transparency')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-white/40">·</span>
            <button
              type="button"
              onClick={() => onNavigate('transparency')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-white/40">·</span>
            <button
              type="button"
              onClick={() => onNavigate('transparency')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Open API Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
};
