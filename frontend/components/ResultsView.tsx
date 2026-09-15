import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  SlidersHorizontal,
  Home,
  FileCheck,
  UserCheck,
  Building,
  ExternalLink,
  Printer,
  Search,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { Scheme, SchemeEligibilityResult, EligibilityStatus, UserProfile } from '../types';
import { EvaluationSkeletonLoader } from './EvaluationSkeletonLoader';

interface ResultsViewProps {
  matches: SchemeEligibilityResult[];
  profile: UserProfile;
  isEvaluating?: boolean;
  onModifyProfile: () => void;
  onReturnHome: () => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

// ---------------------------------------------------------------------------
// Status display configuration
// ---------------------------------------------------------------------------
const STATUS_CONFIG: Record<
  EligibilityStatus,
  {
    label: string;
    badge: string;
    cardBorder: string;
    icon: React.ReactNode;
    bgLight: string;
    textColor: string;
  }
> = {
  ELIGIBLE: {
    label: 'ELIGIBLE',
    badge: 'bg-[#2F6B4F]/15 text-[#2F6B4F] border border-[#2F6B4F]/25',
    cardBorder: 'border-2 border-[#2F6B4F]/35',
    icon: <CheckCircle2 className="w-4 h-4" />,
    bgLight: 'bg-[#2F6B4F]/6',
    textColor: 'text-[#2F6B4F]'
  },
  CONDITIONALLY_ELIGIBLE: {
    label: 'CONDITIONALLY ELIGIBLE',
    badge: 'bg-[#b45309]/10 text-[#b45309] border border-[#b45309]/25',
    cardBorder: 'border-2 border-[#b45309]/25',
    icon: <AlertTriangle className="w-4 h-4" />,
    bgLight: 'bg-[#fffbeb]',
    textColor: 'text-[#b45309]'
  },
  INSUFFICIENT_INFORMATION: {
    label: 'INSUFFICIENT INFORMATION',
    badge: 'bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/25',
    cardBorder: 'border-2 border-[#1d4ed8]/20',
    icon: <HelpCircle className="w-4 h-4" />,
    bgLight: 'bg-[#eff6ff]',
    textColor: 'text-[#1d4ed8]'
  },
  NOT_ELIGIBLE: {
    label: 'NOT ELIGIBLE',
    badge: 'bg-[#C0392B]/10 text-[#C0392B] border border-[#C0392B]/25',
    cardBorder: 'border border-[#c3c6ce]/30',
    icon: <XCircle className="w-4 h-4" />,
    bgLight: 'bg-[#fff5f5]',
    textColor: 'text-[#C0392B]'
  }
};

// Plain language citizen-friendly summaries
const SCHEME_SHORT_SUMMARIES: Record<string, string> = {
  pmegp:    'Government subsidy for starting new manufacturing or service businesses.',
  standup:  'Bank loans up to ₹1 Crore for women and SC/ST entrepreneurs.',
  mudra:    'Collateral-free loans up to ₹20 Lakh for small enterprise growth.',
  aif:      'Subsidized loan support for agricultural and post-harvest infrastructure projects.',
  'mission-shakti':        'Financial and skill support helping women access empowerment programmes.',
  cegssc:   'Collateral-free credit guarantee coverage for Scheduled Caste entrepreneurs.',
  svanidhi: 'Affordable working capital loans with interest subsidy for street vendors.',
  'pm-vishwakarma':        'Low-interest loans, free toolkits, and training for traditional artisans.',
  'post-matric-scholarship': 'Financial support for eligible SC students pursuing higher education.',
  'pm-kisan':  '₹6,000 per year income support for eligible landholding farmer families.',
  'pmay-u-2':  'Housing assistance for eligible urban households under PMAY-U 2.0.',
  'pm-jay':    'Health cover up to ₹5 Lakh per year at empanelled hospitals.'
};

function getSchemeSummary(scheme: Scheme): string {
  if (SCHEME_SHORT_SUMMARIES[scheme.id]) return SCHEME_SHORT_SUMMARIES[scheme.id];
  const words = scheme.description.replace(/\s+/g, ' ').trim().split(' ').slice(0, 11);
  return words.join(' ') + (words.length >= 11 ? '...' : '');
}

// Count helper for summary bar
function countByStatus(matches: SchemeEligibilityResult[]): Record<EligibilityStatus, number> {
  const counts: Record<EligibilityStatus, number> = {
    ELIGIBLE: 0,
    CONDITIONALLY_ELIGIBLE: 0,
    INSUFFICIENT_INFORMATION: 0,
    NOT_ELIGIBLE: 0
  };
  for (const m of matches) counts[m.status]++;
  return counts;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  matches,
  profile,
  isEvaluating = false,
  onModifyProfile,
  onReturnHome,
  onOpenSchemeModal
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('positive');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());

  const toggleCardExpand = (id: string) => {
    setExpandedCardIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isEvaluating) {
    return <EvaluationSkeletonLoader profile={profile} />;
  }

  const counts = countByStatus(matches);
  const positiveCount = counts.ELIGIBLE + counts.CONDITIONALLY_ELIGIBLE + counts.INSUFFICIENT_INFORMATION;

  const filteredMatches = matches.filter(m => {
    const matchesCat = filterCategory === 'all' || m.scheme.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'positive' && m.status !== 'NOT_ELIGIBLE') ||
      filterStatus === m.status;
    const matchesSearch =
      m.scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.statusSummary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const handlePrint = () => window.print();

  return (
    <div id="results-view" className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      {/* Header Strip */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-4">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#2F6B4F] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Eligibility Guidance Results</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-[#001d37] font-bold tracking-tight">
              Your Scheme Results
            </h2>
            <p className="text-sm text-[#43474d] mt-0.5">
              Rule-based eligibility guidance — final eligibility is determined by the relevant government authority.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-[#c3c6ce]/60 text-[#1b1c18] text-xs font-semibold hover:bg-[#f0eee8] transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#45617d]" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onModifyProfile}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#eae8e2] text-[#1b1c18] text-xs font-semibold hover:bg-[#e4e2dd] transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#45617d]" />
              <span>Modify Profile</span>
            </button>
            <button
              type="button"
              onClick={onReturnHome}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Status Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              { status: 'ELIGIBLE', label: 'Eligible', count: counts.ELIGIBLE },
              { status: 'CONDITIONALLY_ELIGIBLE', label: 'Conditionally Eligible', count: counts.CONDITIONALLY_ELIGIBLE },
              { status: 'INSUFFICIENT_INFORMATION', label: 'Needs Info', count: counts.INSUFFICIENT_INFORMATION },
              { status: 'NOT_ELIGIBLE', label: 'Not Eligible', count: counts.NOT_ELIGIBLE }
            ] as const
          ).map(({ status, label, count }) => {
            const cfg = STATUS_CONFIG[status];
            return (
              <div key={status} className={`p-4 rounded-xl border bg-white shadow-xs ${cfg.cardBorder}`}>
                <div className={`flex items-center gap-2 ${cfg.textColor} mb-1`}>
                  {cfg.icon}
                  <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
                </div>
                <span className={`text-2xl font-extrabold ${cfg.textColor}`}>{count}</span>
                <span className="text-xs text-[#74777e] ml-1">scheme{count !== 1 ? 's' : ''}</span>
              </div>
            );
          })}
        </div>

        {/* Profile Summary */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#45617d]/10 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-[#45617d]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#001d37] block">
                {profile.state} • {profile.locationType} • {profile.socialCategory}
              </span>
              <span className="text-xs text-[#43474d]">
                {profile.gender} • Age {profile.age} • {profile.occupation}
              </span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#16324f]/10 flex items-center justify-center shrink-0">
              <Building className="w-5 h-5 text-[#16324F]" />
            </div>
            <div>
              <span className="text-sm font-bold text-[#001d37] block">
                {positiveCount} of {matches.length} potentially relevant
              </span>
              <span className="text-xs text-[#43474d]">
                {counts.NOT_ELIGIBLE} explicitly not eligible
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#f0f4ff] border border-[#b0c0e0]/50 text-xs text-[#3a5a8c]">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-[#4a70c0]" />
          <div>
            <span className="font-bold block mb-0.5">About These Results</span>
            <span>
              This application provides rule-based eligibility guidance using documented scheme criteria.{' '}
              <strong>Final eligibility, sanction, subsidy, loan approval, beneficiary identification, and document verification are performed by the relevant government authority.</strong>{' '}
              CONDITIONALLY ELIGIBLE and INSUFFICIENT INFORMATION results mean the profile appears compatible but requires verification.
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#43474d]" />
            <input
              type="text"
              placeholder="Search schemes..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#c3c6ce]/60 bg-[#fbf9f3] text-sm text-[#1b1c18] focus:outline-hidden focus:border-[#16324F]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 flex-wrap">
            {/* Status filters */}
            {[
              { id: 'positive', label: 'Positive Results' },
              { id: 'all', label: 'All' },
              { id: 'ELIGIBLE', label: 'Eligible' },
              { id: 'CONDITIONALLY_ELIGIBLE', label: 'Conditional' },
              { id: 'NOT_ELIGIBLE', label: 'Not Eligible' }
            ].map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterStatus === f.id
                    ? 'bg-[#16324F] text-white shadow-xs'
                    : 'bg-[#f5f3ed] text-[#43474d] hover:bg-[#eae8e2]'
                }`}
              >
                {f.label}
              </button>
            ))}
            <span className="text-[#c3c6ce] text-lg">|</span>
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'MSME', label: 'MSME' },
              { id: 'Agriculture', label: 'Agriculture' },
              { id: 'Social', label: 'Social' },
              { id: 'Education', label: 'Education' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#45617d] text-white shadow-xs'
                    : 'bg-[#f5f3ed] text-[#43474d] hover:bg-[#eae8e2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Result Cards */}
        <div className="space-y-5">
          {filteredMatches.map(match => {
            const cfg = STATUS_CONFIG[match.status];
            const isExpanded = expandedCardIds.has(match.scheme.id);
            const summary = getSchemeSummary(match.scheme);
            const isNotEligible = match.status === 'NOT_ELIGIBLE';

            return (
              <div
                key={match.scheme.id}
                className={`rounded-2xl bg-white shadow-xs hover:shadow-md transition-shadow ${cfg.cardBorder} ${isNotEligible ? 'opacity-85' : ''}`}
              >
                {/* Card Header */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Status badge */}
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1.5 ${cfg.badge}`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </span>

                      {/* Scheme name */}
                      <h3 className="font-heading text-lg sm:text-xl text-[#001d37] font-bold tracking-tight leading-snug">
                        {match.scheme.title}
                      </h3>

                      {/* Ministry */}
                      <p className="text-xs text-[#74777e]">{match.scheme.ministry}</p>
                    </div>

                    {/* Benefit — not shown for NOT_ELIGIBLE */}
                    {!isNotEligible && (
                      <div className="shrink-0 sm:text-right pt-0.5">
                        <span className="text-base sm:text-lg font-extrabold text-[#085041] block tracking-tight leading-tight">
                          {match.benefitDescription}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status summary */}
                  <p className={`text-sm leading-relaxed ${cfg.textColor} font-medium`}>
                    {match.statusSummary}
                  </p>

                  {/* Plain description */}
                  <p className="text-xs text-[#43474d] leading-relaxed">{summary}</p>

                  {/* Satisfied criteria count pill */}
                  {!isNotEligible && (
                    <div className="flex flex-wrap gap-2">
                      {match.satisfiedCriteria.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#2F6B4F]/10 text-[#2F6B4F] border border-[#2F6B4F]/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {match.satisfiedCriteria.length} satisfied
                        </span>
                      )}
                      {match.missingCriteria.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#1d4ed8]/10 text-[#1d4ed8] border border-[#1d4ed8]/20">
                          <HelpCircle className="w-3.5 h-3.5" />
                          {match.missingCriteria.length} need info
                        </span>
                      )}
                      {match.verificationRequired.length > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#b45309]/10 text-[#b45309] border border-[#b45309]/20">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {match.verificationRequired.length} need verification
                        </span>
                      )}
                    </div>
                  )}

                  {/* For NOT_ELIGIBLE — show failed criterion immediately */}
                  {isNotEligible && match.failedCriteria.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#fff5f5] border border-[#C0392B]/20 space-y-2">
                      <span className="text-[11px] uppercase font-bold text-[#C0392B] tracking-wider block">
                        Failed Criterion:
                      </span>
                      {match.failedCriteria.filter(c => c.mandatory).map((c, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-[#C0392B]">
                          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold">{c.description}</span>
                            <br />
                            <span className="text-[#7f1d1d]/80">{c.explanation}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Detail Section */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-5 space-y-4 border-t border-[#c3c6ce]/20 pt-4 animate-in fade-in duration-200">

                    {/* Satisfied criteria */}
                    {match.satisfiedCriteria.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#2F6B4F]/20 space-y-2">
                        <span className="text-[11px] uppercase font-bold text-[#2F6B4F] tracking-wider block">
                          ✓ Satisfied Criteria ({match.satisfiedCriteria.length})
                        </span>
                        {match.satisfiedCriteria.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#1b1c18]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">{c.description}</span>
                              <br />
                              <span className="text-[#43474d]">{c.explanation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Missing info criteria */}
                    {match.missingCriteria.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#eff6ff] border border-[#1d4ed8]/20 space-y-2">
                        <span className="text-[11px] uppercase font-bold text-[#1d4ed8] tracking-wider block">
                          • Information Required ({match.missingCriteria.length})
                        </span>
                        {match.missingCriteria.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#1b1c18]">
                            <HelpCircle className="w-3.5 h-3.5 text-[#1d4ed8] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">{c.description}</span>
                              <br />
                              <span className="text-[#43474d]">{c.explanation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Verification required */}
                    {match.verificationRequired.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#b45309]/20 space-y-2">
                        <span className="text-[11px] uppercase font-bold text-[#b45309] tracking-wider block">
                          ⚠ Official Verification Required ({match.verificationRequired.length})
                        </span>
                        {match.verificationRequired.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#1b1c18]">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#b45309] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">{c.description}</span>
                              <br />
                              <span className="text-[#43474d]">{c.explanation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Failed criteria (for NOT_ELIGIBLE — all failures) */}
                    {isNotEligible && match.failedCriteria.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-[#fff5f5] border border-[#C0392B]/20 space-y-2">
                        <span className="text-[11px] uppercase font-bold text-[#C0392B] tracking-wider block">
                          ✗ Failed Criteria ({match.failedCriteria.length})
                        </span>
                        {match.failedCriteria.map((c, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#C0392B]">
                            <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-semibold">{c.description}</span>
                              <br />
                              <span className="text-[#7f1d1d]/80">{c.explanation}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Full description */}
                    <div>
                      <span className="text-[11px] uppercase font-bold text-[#74777e] tracking-wider block mb-1">About This Scheme</span>
                      <p className="text-xs text-[#43474d] leading-relaxed">{match.scheme.description}</p>
                    </div>

                    {/* Required Documents */}
                    {match.scheme.requiredDocuments && match.scheme.requiredDocuments.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-white border border-[#c3c6ce]/30 space-y-2">
                        <span className="text-[11px] uppercase font-bold text-[#43474d] tracking-wider block">
                          Required Document Checklist:
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#43474d]">
                          {match.scheme.requiredDocuments.map((doc, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#16324F] shrink-0 mt-1.5" />
                              <span>{doc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Source note */}
                    <div className="flex items-start gap-2 text-[11px] text-[#74777e] bg-[#f5f3ed] p-3 rounded-lg border border-[#c3c6ce]/25">
                      <FileCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>
                        <strong>Source:</strong> {match.scheme.ministry} — {match.scheme.statutoryClause}.{' '}
                        Rule-based guidance only. Final eligibility determined by the relevant authority.
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-t border-[#c3c6ce]/20">
                  <button
                    type="button"
                    onClick={() => toggleCardExpand(match.scheme.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#16324F] hover:text-[#001d37] transition-colors cursor-pointer py-1"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{isExpanded ? 'Hide details' : 'View full details'}</span>
                  </button>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => onOpenSchemeModal(match.scheme)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#45617d] hover:text-[#16324F] transition-colors cursor-pointer"
                    >
                      <Info className="w-4 h-4" />
                      <span className="hidden sm:inline">Official Guidelines</span>
                    </button>

                    <a
                      href={match.scheme.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#16324F] text-white text-xs font-semibold hover:bg-[#10243a] transition-colors shadow-xs"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state — when all schemes are filtered out */}
          {filteredMatches.length === 0 && matches.length > 0 && (
            <div className="text-center py-12 p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
              <Layers className="w-10 h-10 text-[#74777e] mx-auto mb-2" />
              <h3 className="text-base font-bold text-[#001d37]">No schemes match the current filter</h3>
              <p className="text-xs text-[#43474d] mt-1">
                Try switching the status or category filter.
              </p>
              <button
                onClick={() => { setFilterStatus('all'); setFilterCategory('all'); setSearchTerm(''); }}
                className="mt-3 text-xs font-bold text-[#16324F] underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* No schemes at all — genuine empty result */}
          {matches.length === 0 && (
            <div className="text-center py-16 p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
              <Layers className="w-12 h-12 text-[#74777e] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#001d37]">No matching schemes found</h3>
              <p className="text-sm text-[#43474d] mt-2 max-w-md mx-auto">
                Based on your profile, none of the evaluated schemes appear applicable.
                This is a valid result — the system does not suggest schemes where eligibility cannot be established.
              </p>
              <button
                type="button"
                onClick={onModifyProfile}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-bold hover:bg-[#10243a] transition-all cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Modify Profile</span>
              </button>
            </div>
          )}
        </div>

        {/* Trust & Privacy Assurance Bar */}
        <div className="p-4 rounded-xl bg-[#f5f3ed] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#43474d] border border-[#c3c6ce]/30">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> No login required
            </span>
            <span className="text-[#c3c6ce]">•</span>
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> Privacy-first in-browser evaluation
            </span>
            <span className="text-[#c3c6ce]">•</span>
            <span className="flex items-center gap-1 text-[#1b1c18] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2F6B4F]" /> Rule-based guidance, not official certification
            </span>
          </div>

          <button
            type="button"
            onClick={onReturnHome}
            className="text-xs text-[#45617d] hover:text-[#16324F] font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
