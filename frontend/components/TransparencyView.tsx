import React from 'react';
import {
  ShieldCheck,
  ArrowRight,
  Scale,
  FileCheck,
  Lock,
  ExternalLink,
  Code
} from 'lucide-react';

interface TransparencyViewProps {
  onStartEligibility: () => void;
}

export const TransparencyView: React.FC<TransparencyViewProps> = ({ onStartEligibility }) => {
  return (
    <div id="transparency-view" className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      {/* Header Banner */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-5">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#2F6B4F] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Auditable Civic Logic</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#001d37] font-bold tracking-tight">
              Transparency &amp; Deterministic Rules
            </h2>
            <p className="text-sm text-[#43474d] mt-1">
              Our commitment to explainable evaluation without black-box AI or hidden bias.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartEligibility}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-semibold hover:bg-[#10243a] transition-all shadow-xs cursor-pointer group shrink-0"
          >
            <span>Start Verification</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#16324f]/10 flex items-center justify-center text-[#16324F] mb-1">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg text-[#001d37] font-bold">
              Gazetted Source Attribution
            </h3>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              Every scheme rule is mapped directly to government gazette notifications, operational guidelines, and ministry circulars with authentic clause references.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] mb-1">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg text-[#001d37] font-bold">
              Deterministic Logic Engine
            </h3>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              Zero generative guessing. Eligibility is verified via formal Boolean logic trees that can be audited step-by-step by any citizen or public interest researcher.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#C0392B]/10 flex items-center justify-center text-[#C0392B] mb-1">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-heading text-lg text-[#001d37] font-bold">
              Zero Data Retention
            </h3>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
              No personally identifiable information (PII) or Aadhaar numbers are stored or tracked. All calculations execute client-side in browser memory for maximum citizen privacy.
            </p>
          </div>
        </div>

        {/* Rule Example Table */}
        <div className="p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#c3c6ce]/20 pb-3">
            <div>
              <h3 className="font-heading text-lg sm:text-xl text-[#001d37] font-bold">
                Sample Verified Evaluation Matrix
              </h3>
              <p className="text-xs text-[#43474d] mt-0.5">
                Exact statutory specifications parsed by SchemeSetu's deterministic engine.
              </p>
            </div>
            <span className="text-xs text-[#2F6B4F] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-[#2F6B4F]/10 w-fit">
              Active Audit Protocol v2.4
            </span>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm">
            <div className="p-3 rounded-lg bg-[#f5f3ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#c3c6ce]/20">
              <div>
                <span className="font-bold text-[#001d37]">PMEGP Clause 4.2:</span>
                <span className="text-[#43474d] ml-1.5 leading-relaxed">
                  General category subsidy in Urban (15%) vs Rural (25%). Special category subsidy in Urban (25%) vs Rural (35%). Women/OBC/SC/ST receive affirmative priority.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] font-bold shrink-0 uppercase tracking-wider">
                DETERMINISTIC RULE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f5f3ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#c3c6ce]/20">
              <div>
                <span className="font-bold text-[#001d37]">Stand-Up India Rule 1.1:</span>
                <span className="text-[#43474d] ml-1.5 leading-relaxed">
                  Applicant must be SC, ST, or Woman entrepreneur for Greenfield enterprise. In non-individual enterprises, 51% shareholding must be held by SC/ST or Woman.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] font-bold shrink-0 uppercase tracking-wider">
                DETERMINISTIC RULE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f5f3ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#c3c6ce]/20">
              <div>
                <span className="font-bold text-[#001d37]">PMMY Section 3 (MUDRA):</span>
                <span className="text-[#43474d] ml-1.5 leading-relaxed">
                  Shishu loans up to ₹50,000, Kishore up to ₹5 Lakh, and Tarun up to ₹10 Lakh without collateral requirement. Mandates non-farm micro enterprise qualification.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] font-bold shrink-0 uppercase tracking-wider">
                DETERMINISTIC RULE
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#f5f3ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-[#c3c6ce]/20">
              <div>
                <span className="font-bold text-[#001d37]">AIF Clause 5.1 (Agri Infrastructure):</span>
                <span className="text-[#43474d] ml-1.5 leading-relaxed">
                  Post-harvest infrastructure debt financing receives 3% per annum interest subvention up to ₹2 Crore for a maximum duration of 7 years.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] font-bold shrink-0 uppercase tracking-wider">
                DETERMINISTIC RULE
              </span>
            </div>
          </div>
        </div>

        {/* Verification Methodology Code Sample / Explainer */}
        <div className="p-6 rounded-xl bg-[#102336] text-white space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Code className="w-5 h-5 text-[#2F6B4F]" />
            <h4 className="font-heading text-base sm:text-lg font-bold">Open Public Verification Principle</h4>
          </div>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-3xl">
            Citizens can cross-reference the logic used on this website with the actual Gazette notifications on the Government of India Gazette portal (egazette.gov.in) and National Portal of India (india.gov.in).
          </p>
          <div className="pt-2">
            <a
              href="https://egazette.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white underline"
            >
              <span>Access Official Gazette Archives (egazette.gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
