import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cpu } from 'lucide-react';
import { UserProfile } from '../types';

interface EvaluationSkeletonLoaderProps {
  profile: UserProfile;
}

const EVALUATION_STAGES = [
  'Ingesting applicant profile & demographic constraints...',
  'Evaluating 42 statutory criteria against Central & State gazettes...',
  'Cross-referencing rural/urban spatial zoning mandates...',
  'Checking age ceilings and educational pre-qualifications...',
  'Validating affirmative social category & priority lending allocations...',
  'Calculating permissible capital subsidies and credit guarantee ceilings...',
  'Finalizing deterministic eligibility ranking & statutory justifications...'
];

export const EvaluationSkeletonLoader: React.FC<EvaluationSkeletonLoaderProps> = ({ profile }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    const stageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % EVALUATION_STAGES.length);
    }, 280);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + Math.floor(Math.random() * 12 + 8) : 95));
    }, 180);

    return () => {
      clearInterval(stageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div id="evaluation-skeleton-loader" className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      {/* Header Strip with Live Rules Engine Processing State */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#16324F]/10 text-[#16324F] text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 animate-spin text-[#16324F]" />
              <span>Rules Engine Active • Processing Profile</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#001d37] font-bold tracking-tight flex items-center gap-3">
              Evaluating Statutory Eligibility
              <span className="inline-flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D9E75]"></span>
              </span>
            </h2>
            <p className="text-sm text-[#43474d] flex items-center gap-1.5">
              <span className="font-semibold text-[#1b1c18]">{EVALUATION_STAGES[stageIndex]}</span>
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex flex-col sm:items-end justify-center min-w-[220px]">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-bold text-[#16324F] mb-1.5">
              <span>Deterministic Verification</span>
              <span className="tabular-nums font-mono text-sm text-[#1D9E75]">{Math.min(progress, 98)}%</span>
            </div>
            <div className="w-full h-2 bg-[#eae8e2] rounded-full overflow-hidden border border-[#c3c6ce]/30">
              <div
                className="h-full bg-gradient-to-r from-[#16324F] via-[#2F6B4F] to-[#1D9E75] transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(progress, 98)}%` }}
              />
            </div>
            <span className="text-[11px] text-[#45617d] mt-1 font-medium">
              Zero Hallucinations • Statutory Match
            </span>
          </div>
        </div>
      </div>

      {/* Main Skeleton Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Metric Strip Skeletons (3 Summary Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 sm:p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
          {/* Metric 1 */}
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-[#e4e2dd] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 bg-[#e4e2dd] rounded w-36" />
              <div className="h-3 bg-[#eae8e2] rounded w-48" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="flex items-center gap-3 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#c3c6ce]/30 pt-3 md:pt-0 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-[#eae8e2] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 bg-[#e4e2dd] rounded w-44" />
              <div className="h-3 bg-[#eae8e2] rounded w-32" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="flex items-center gap-3 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-[#c3c6ce]/30 pt-3 md:pt-0 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-[#e4e2dd] shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-5 bg-[#e4e2dd] rounded w-40" />
              <div className="h-3 bg-[#eae8e2] rounded w-28" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar Skeleton */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs animate-pulse">
          <div className="h-9 rounded-lg bg-[#eae8e2] flex-1 max-w-md" />
          <div className="flex items-center gap-2 overflow-x-auto">
            <div className="h-8 w-20 rounded-lg bg-[#16324F]/20" />
            <div className="h-8 w-18 rounded-lg bg-[#eae8e2]" />
            <div className="h-8 w-24 rounded-lg bg-[#eae8e2]" />
            <div className="h-8 w-28 rounded-lg bg-[#eae8e2]" />
            <div className="h-8 w-20 rounded-lg bg-[#eae8e2]" />
          </div>
        </div>

        {/* Scheme Cards Skeleton List (3 Cards) */}
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-4 animate-pulse"
            >
              {/* Card Top: Badges, Title & Subsidy Skeleton */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-2 border-b border-[#f0eee8]">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 rounded bg-[#2F6B4F]/20" />
                    <div className="h-2 w-2 rounded-full bg-[#c3c6ce]" />
                    <div className="h-4 w-24 rounded bg-[#eae8e2]" />
                  </div>
                  <div className="h-6 w-3/4 sm:w-2/3 rounded bg-[#e4e2dd]" />
                  <div className="h-3.5 w-1/3 rounded bg-[#eae8e2]" />
                </div>

                <div className="sm:text-right space-y-1 shrink-0">
                  <div className="h-6 w-36 rounded bg-[#2F6B4F]/20 sm:ml-auto" />
                  <div className="h-3.5 w-24 rounded bg-[#eae8e2] sm:ml-auto" />
                </div>
              </div>

              {/* Description Skeleton */}
              <div className="space-y-2 pt-1">
                <div className="h-3.5 bg-[#f0eee8] rounded w-full" />
                <div className="h-3.5 bg-[#f0eee8] rounded w-5/6" />
              </div>

              {/* Statutory Justification Box Skeleton */}
              <div className="p-3.5 rounded-lg bg-[#f5f3ed] border border-[#c3c6ce]/20 space-y-2">
                <div className="h-3 w-40 rounded bg-[#e4e2dd]" />
                <div className="h-3.5 w-full rounded bg-[#eae8e2]" />
                <div className="h-3.5 w-4/5 rounded bg-[#eae8e2]" />
              </div>

              {/* Matched Criteria Checklist Skeleton (2 cols) */}
              <div className="p-3.5 rounded-lg bg-[#fbf9f3] border border-[#c3c6ce]/20 space-y-2.5">
                <div className="h-3 w-32 rounded bg-[#e4e2dd]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2F6B4F]/30 shrink-0" />
                    <div className="h-3.5 w-48 rounded bg-[#eae8e2]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2F6B4F]/30 shrink-0" />
                    <div className="h-3.5 w-56 rounded bg-[#eae8e2]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2F6B4F]/30 shrink-0" />
                    <div className="h-3.5 w-52 rounded bg-[#eae8e2]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2F6B4F]/30 shrink-0" />
                    <div className="h-3.5 w-44 rounded bg-[#eae8e2]" />
                  </div>
                </div>
              </div>

              {/* Actions Skeleton */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-44 rounded-lg bg-[#16324F]/15" />
                  <div className="h-9 w-32 rounded-lg bg-[#eae8e2]" />
                </div>
                <div className="h-4 w-28 rounded bg-[#eae8e2]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
