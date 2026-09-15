import React from 'react';
import { CheckCircle2, ArrowDown, Sparkles } from 'lucide-react';

interface AnimatedHeroEngineDemoProps {
  chipRefs: React.MutableRefObject<(HTMLSpanElement | null)[]>;
  ruleRowRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  rulesStatusRef: React.RefObject<HTMLSpanElement | null>;
  resultCardRef: React.RefObject<HTMLDivElement | null>;
}

const PROFILE_CHIPS = [
  'Age: 29',
  'Female',
  'OBC',
  'Maharashtra • Rural',
  'New Business'
];

const RULE_ROWS = [
  'Your age meets the scheme requirement',
  'Your project cost is within the allowed limit',
  'Your location qualifies for the scheme',
  'You qualify for special category benefits'
];

export const AnimatedHeroEngineDemo: React.FC<AnimatedHeroEngineDemoProps> = ({
  chipRefs,
  ruleRowRefs,
  rulesStatusRef,
  resultCardRef
}) => {
  return (
    <div className="w-full relative flex flex-col items-center select-none space-y-2.5">
      {/* ================= CARD 01: Profile Ingestion & Chips ================= */}
      <div className="w-full rounded-xl bg-white p-4 shadow-xs border border-[#c3c6ce]/40 transition-all">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#f0eee8]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
              01 / Profile Input
            </span>
            <span className="text-sm text-[#001d37] font-semibold">
              Live Applicant Profile Stream
            </span>
          </div>
          <span className="text-[10px] text-[#45617d] font-medium tracking-wide flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse"></span>
            Active
          </span>
        </div>

        {/* Phase 3: Profile Chips Row */}
        <div className="pt-3">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {PROFILE_CHIPS.map((chip, index) => (
              <span
                key={chip}
                ref={(el) => {
                  chipRefs.current[index] = el;
                }}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-300 bg-[#f5f3ed] text-[#43474d] border border-[#c3c6ce]/30"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Down Connector 1 */}
      <div className="flex flex-col items-center justify-center py-0 relative z-0">
        <div className="h-3 w-[1.5px] bg-[#16324F]/30"></div>
        <ArrowDown className="w-3.5 h-3.5 text-[#16324F] -mt-1" />
      </div>

      {/* ================= CARD 02: Deterministic Rule Engine Rows ================= */}
      <div className="w-full rounded-xl bg-white p-4 shadow-xs border border-[#c3c6ce]/40 transition-all">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#f0eee8]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
              02 / ELIGIBILITY CHECK
            </span>
            <span className="text-sm text-[#001d37] font-semibold">
              We check if you qualify
            </span>
          </div>
          {/* Status label updates via direct DOM ref */}
          <span
            ref={rulesStatusRef}
            className="text-xs font-bold transition-all duration-300 flex items-center gap-1 text-[#45617d]"
          >
            Checking criteria...
          </span>
        </div>

        {/* Phase 4: Sequential Rule Checks */}
        <div className="space-y-1.5 pt-2.5 min-h-[148px] flex flex-col justify-start">
          {RULE_ROWS.map((rule, idx) => (
            <div
              key={rule}
              ref={(el) => {
                ruleRowRefs.current[idx] = el;
              }}
              style={{ opacity: 0, transform: 'translateY(-4px)' }}
              className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#f5f3ed] border border-[#c3c6ce]/20"
            >
              <div className="flex items-center gap-2 pr-2">
                <CheckCircle2 className="w-4 h-4 text-[#1D9E75] shrink-0" />
                <span className="text-[#1b1c18] font-medium leading-tight">
                  {rule}
                </span>
              </div>
              <span className="text-[11px] bg-[#1D9E75]/15 text-[#1D9E75] font-bold px-2 py-0.5 rounded tracking-wider uppercase shrink-0">
                PASS
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Down Connector 2 */}
      <div className="flex flex-col items-center justify-center py-0 relative z-0">
        <div className="h-3 w-[1.5px] bg-[#16324F]/30"></div>
        <ArrowDown className="w-3.5 h-3.5 text-[#16324F] -mt-1" />
      </div>

      {/* ================= CARD 03: Phase 5 Result Card ================= */}
      <div
        ref={resultCardRef}
        style={{ opacity: 0, transform: 'translateY(8px)', border: '1px solid rgba(195,198,206,0.4)' }}
        className="w-full rounded-xl bg-white px-3.5 py-2.5 sm:px-4 sm:py-2.5 shadow-md"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold text-[#1D9E75] tracking-tight font-heading leading-none">
                98% match
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase leading-none">
                CENTRAL SECTOR
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-bold text-[#001d37] mt-1 tracking-tight leading-tight">
              Prime Minister Employment Generation Programme
            </h3>
            <span className="text-[11px] text-[#45617d] font-medium block mt-0.5 leading-none">
              Ministry of MSME
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1D9E75]/15 text-[#1D9E75] text-[11px] font-bold shrink-0 leading-none">
            <Sparkles className="w-3 h-3" />
            Verified
          </span>
        </div>

        {/* Benefit Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 pt-1.5 border-t border-[#f0eee8]">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1D9E75]/15 text-[#1D9E75] leading-normal">
            35% capital subsidy
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#16324F]/10 text-[#16324F] leading-normal">
            Up to ₹50L
          </span>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#f5f3ed] text-[#43474d] leading-normal">
            +4 more
          </span>
        </div>
      </div>
    </div>
  );
};
