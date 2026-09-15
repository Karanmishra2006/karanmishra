import React from 'react';
import { X, ShieldCheck, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface CitizenInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onResetSession: () => void;
  onStartEvaluation: () => void;
}

export const CitizenInfoModal: React.FC<CitizenInfoModalProps> = ({
  isOpen,
  onClose,
  profile,
  onResetSession,
  onStartEvaluation
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001d37]/50 backdrop-blur-xs p-4">
      <div
        className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-[#c3c6ce]/40 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#c3c6ce]/20">
          <div className="flex items-center gap-2 text-[#16324F]">
            <ShieldCheck className="w-5 h-5 text-[#2F6B4F]" />
            <h3 className="font-heading text-lg font-bold">Citizen Session &amp; Privacy Status</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#43474d] hover:bg-[#eae8e2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[#43474d]">
          <div className="p-3 rounded-lg bg-[#f5f3ed] space-y-1.5 border border-[#c3c6ce]/20">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#001d37]">Active Memory Session</span>
              <span className="px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] text-[10px] font-bold uppercase tracking-wider">
                Ephemeral
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[#43474d]">
              SchemeSetu operates with zero persistent tracking. Your inputs remain purely in your browser runtime and are never uploaded to any remote surveillance or profile database.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-[#1b1c18] block">Current Working Parameters:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-[#fbf9f3] border border-[#c3c6ce]/20">
                <span className="text-[#74777e] block">State:</span>
                <span className="font-semibold text-[#1b1c18]">{profile.state}</span>
              </div>
              <div className="p-2 rounded bg-[#fbf9f3] border border-[#c3c6ce]/20">
                <span className="text-[#74777e] block">Category:</span>
                <span className="font-semibold text-[#1b1c18]">{profile.socialCategory}</span>
              </div>
              <div className="p-2 rounded bg-[#fbf9f3] border border-[#c3c6ce]/20">
                <span className="text-[#74777e] block">Area:</span>
                <span className="font-semibold text-[#1b1c18]">{profile.locationType}</span>
              </div>
              <div className="p-2 rounded bg-[#fbf9f3] border border-[#c3c6ce]/20">
                <span className="text-[#74777e] block">Goal:</span>
                <span className="font-semibold text-[#1b1c18]">{profile.supportGoal}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#2F6B4F] font-semibold pt-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>DPDP Act (2023) Non-Custodial Compliance Verified</span>
          </div>
        </div>

        <div className="pt-3 border-t border-[#c3c6ce]/20 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onResetSession}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#f0eee8] text-[#43474d] text-xs font-semibold hover:bg-[#eae8e2] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartEvaluation();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors shadow-xs cursor-pointer"
          >
            <span>Launch Eligibility Flow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
