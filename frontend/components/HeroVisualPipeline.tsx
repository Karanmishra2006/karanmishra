import React from 'react';
import { BadgeCheck, CheckCircle2, FileCheck, ArrowDown } from 'lucide-react';

interface HeroVisualPipelineProps {
  onCardClick?: () => void;
}

export const HeroVisualPipeline: React.FC<HeroVisualPipelineProps> = ({ onCardClick }) => {
  return (
    <div className="w-full relative flex flex-col items-center select-none">
      <div className="w-full space-y-2 relative">
        {/* Card 01: Profile Ingestion */}
        <div
          onClick={onCardClick}
          className="w-full rounded-xl bg-white p-4 shadow-xs border border-[#c3c6ce]/30 transition-all hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#f0eee8]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
                01 / Profile Input
              </span>
              <span className="text-sm text-[#001d37] font-semibold">
                Basic Details &amp; Business Profile
              </span>
            </div>
            <BadgeCheck className="w-5 h-5 text-[#45617d] shrink-0" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5">
            <div className="p-2 rounded bg-[#f5f3ed] flex flex-col">
              <span className="text-[10px] text-[#43474d] uppercase tracking-wider font-semibold">
                Business Type
              </span>
              <span className="text-sm font-semibold text-[#001d37] truncate mt-0.5">
                MSME / Agro
              </span>
            </div>
            <div className="p-2 rounded bg-[#f5f3ed] flex flex-col">
              <span className="text-[10px] text-[#43474d] uppercase tracking-wider font-semibold">
                State / Location
              </span>
              <span className="text-sm font-semibold text-[#001d37] truncate mt-0.5">
                Maharashtra
              </span>
            </div>
            <div className="p-2 rounded bg-[#f5f3ed] flex flex-col">
              <span className="text-[10px] text-[#43474d] uppercase tracking-wider font-semibold">
                Annual Turnover
              </span>
              <span className="text-sm font-semibold text-[#001d37] truncate mt-0.5">
                ₹12.00 Lakhs
              </span>
            </div>
            <div className="p-2 rounded bg-[#f5f3ed] flex flex-col">
              <span className="text-[10px] text-[#43474d] uppercase tracking-wider font-semibold">
                Applicant Category
              </span>
              <span className="text-sm font-semibold text-[#2F6B4F] truncate mt-0.5">
                Woman Entr.
              </span>
            </div>
          </div>
        </div>

        {/* Connector 1 */}
        <div className="flex flex-col items-center justify-center py-0.5 relative z-10">
          <div className="h-4 w-[1.5px] bg-[#16324F]/30"></div>
          <ArrowDown className="w-3.5 h-3.5 text-[#16324F] -mt-1" />
        </div>

        {/* Card 02: Deterministic Rule Engine Verification */}
        <div
          onClick={onCardClick}
          className="w-full rounded-xl bg-white p-4 shadow-xs border border-[#c3c6ce]/30 transition-all hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between pb-2 border-b border-[#f0eee8]">
            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] font-bold tracking-wider uppercase">
                02 / ELIGIBILITY CHECK
              </span>
              <span className="text-sm text-[#001d37] font-semibold">
                We check if you qualify
              </span>
            </div>
            <FileCheck className="w-5 h-5 text-[#2F6B4F] shrink-0" />
          </div>

          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs p-1.5 rounded bg-[#f5f3ed]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="text-[#1b1c18] font-medium">Your age meets the scheme requirement</span>
              </div>
              <span className="text-[11px] text-[#2F6B4F] font-bold uppercase tracking-wider">
                PASS
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-1.5 rounded bg-[#f5f3ed]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="text-[#1b1c18] font-medium">Your project cost is within the allowed limit</span>
              </div>
              <span className="text-[11px] text-[#2F6B4F] font-bold uppercase tracking-wider">
                PASS
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-1.5 rounded bg-[#f5f3ed]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="text-[#1b1c18] font-medium">Your location qualifies for the scheme</span>
              </div>
              <span className="text-[11px] text-[#2F6B4F] font-bold uppercase tracking-wider">
                PASS
              </span>
            </div>

            <div className="flex items-center justify-between text-xs p-1.5 rounded bg-[#f5f3ed]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B4F] shrink-0" />
                <span className="text-[#1b1c18] font-medium">You qualify for special category benefits</span>
              </div>
              <span className="text-[11px] text-[#2F6B4F] font-bold uppercase tracking-wider">
                PASS
              </span>
            </div>
          </div>
        </div>

        {/* Connector 2 */}
        <div className="flex flex-col items-center justify-center py-0.5 relative z-10">
          <div className="h-4 w-[1.5px] bg-[#16324F]/30"></div>
          <ArrowDown className="w-3.5 h-3.5 text-[#16324F] -mt-1" />
        </div>

        {/* Card 03: Scheme Matches & Transparent Rationale */}
        <div
          onClick={onCardClick}
          className="w-full rounded-xl bg-white p-4 shadow-md border border-[#C0392B]/30 hover:border-[#C0392B]/60 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#ffdad6] text-[#C0392B] font-bold tracking-wider uppercase">
                03 / Verified Match Found
              </span>
              <h2 className="text-base font-bold text-[#001d37] mt-1 tracking-tight">
                PMEGP — Prime Minister Employment Generation
              </h2>
              <span className="text-xs text-[#43474d] block mt-0.5">
                Ministry of Micro, Small &amp; Medium Enterprises
              </span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded bg-[#ffdad6] text-[#C0392B] text-xs font-bold tracking-wider uppercase shrink-0">
              95% Fit Rating
            </span>
          </div>

          {/* Transparent Reasoning Box */}
          <div className="mt-3 p-2.5 rounded bg-[#f5f3ed] space-y-1 border border-[#c3c6ce]/20">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffdad6] text-[#C0392B] font-bold tracking-wider uppercase">
                03 / Verified Match Found
              </span>
              <span className="text-xs text-[#001d37] font-semibold">
                Statutory Justification
              </span>
            </div>
            <p className="text-xs text-[#43474d] leading-relaxed">
              Eligible under <strong className="text-[#1b1c18] font-semibold">PMEGP Clause 4.2</strong> for 25% Capital Subsidy for non-farm rural enterprises, plus an additional 10% affirmative allowance for Women Entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
