import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle, FileText } from 'lucide-react';
import { Scheme } from '../types';

interface SchemeModalProps {
  scheme: Scheme | null;
  onClose: () => void;
}

export const SchemeModal: React.FC<SchemeModalProps> = ({ scheme, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#001d37]/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-[#c3c6ce]/40 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-[#c3c6ce]/30 bg-[#f5f3ed]">
          <div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#2F6B4F]/15 text-[#2F6B4F] font-bold tracking-wider uppercase inline-block mb-1.5">
              {scheme.sectorType}
            </span>
            <h3 className="font-heading text-lg sm:text-xl text-[#001d37] font-bold leading-snug">
              {scheme.title}
            </h3>
            <p className="text-xs text-[#45617d] font-semibold mt-0.5">{scheme.ministry}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#43474d] hover:bg-[#eae8e2] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Scheme Objective */}
          <div>
            <h4 className="text-xs text-[#1b1c18] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#16324F]" />
              <span>Scheme Objective</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed bg-[#fbf9f3] p-3 rounded-lg border border-[#c3c6ce]/20">
              {scheme.objectives || scheme.description}
            </p>
          </div>

          {/* Eligibility Parameters */}
          <div>
            <h4 className="text-xs text-[#1b1c18] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#2F6B4F]" />
              <span>Statutory Eligibility Criteria</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#43474d]">
              {scheme.eligibilityParameters.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#2F6B4F] font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Required Document Checklist */}
          <div>
            <h4 className="text-xs text-[#1b1c18] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#C0392B]" />
              <span>Prerequisite Document Checklist</span>
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#43474d]">
              {scheme.requiredDocuments.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#16324F] font-bold shrink-0 mt-0.5">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-[#c3c6ce]/30 bg-[#f5f3ed] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#f0eee8] text-[#1b1c18] text-xs font-semibold hover:bg-[#eae8e2] transition-colors cursor-pointer"
          >
            Close
          </button>
          <a
            href={scheme.officialPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors shadow-xs"
          >
            <span>Visit Official Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
