import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  Search,
  Eye,
  ExternalLink,
  Layers
} from 'lucide-react';
import { Scheme } from '../types';

interface RepositoryViewProps {
  onStartEligibility: () => void;
  onOpenSchemeModal: (scheme: Scheme) => void;
}

export const RepositoryView: React.FC<RepositoryViewProps> = ({
  onStartEligibility,
  onOpenSchemeModal
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Schemes fetched from MongoDB through backend API
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('https://karanmishra.onrender.com/api/schemes')

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setSchemes(result.data);
        } else {
          console.error('Failed to fetch schemes:', result.message);
        }
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'MSME' && s.category === 'MSME') ||
      (activeCategory === 'Agriculture' && s.category === 'Agriculture') ||
      (activeCategory === 'Social' && s.category === 'Social') ||
      (activeCategory === 'Education' && s.category === 'Education');

    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      s.title.toLowerCase().includes(query) ||
      s.ministry.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.benefitHeadline.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div
      id="schemes-view"
      className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16"
    >
      {/* Header Banner */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-5">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#45617d] font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Official Repository</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl text-[#001d37] font-bold tracking-tight">
              Central &amp; State Scheme Database
            </h2>

            <p className="text-sm text-[#43474d] mt-1">
              Browse, search, and verify government welfare programs, credit
              subsidies, and empowerment funds.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartEligibility}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-semibold hover:bg-[#10243a] transition-all shadow-xs cursor-pointer group shrink-0"
          >
            <span>Check My Eligibility</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Search & Category Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#43474d]" />

            <input
              type="text"
              placeholder="Search schemes by name, keyword, or ministry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#c3c6ce]/60 bg-[#fbf9f3] text-sm text-[#1b1c18] focus:outline-hidden focus:border-[#16324F]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Schemes' },
              { id: 'MSME', label: 'MSME & Business' },
              { id: 'Agriculture', label: 'Agriculture' },
              { id: 'Social', label: 'Women & Social' },
              { id: 'Education', label: 'Education & Skills' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'border border-[#16324F] bg-[#16324F] text-white shadow-xs'
                    : 'border border-[#c3c6ce]/50 bg-[#fbf9f3] text-[#1b1c18] hover:bg-[#eae8e2]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
            <div className="w-8 h-8 border-2 border-[#16324F]/30 border-t-[#16324F] rounded-full animate-spin mx-auto mb-3" />

            <h3 className="text-base font-bold text-[#001d37]">
              Loading government schemes...
            </h3>

            <p className="text-xs text-[#43474d] mt-1">
              Fetching verified scheme data.
            </p>
          </div>
        )}

        {/* Schemes Cards Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="flex flex-col justify-between p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#eae8e2] text-[#45617d] text-[11px] font-bold tracking-wider uppercase">
                      {scheme.sectorType}
                    </span>

                    <span className="text-xs text-[#2F6B4F] font-bold uppercase text-right">
                      {scheme.benefitHeadline}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg text-[#001d37] font-bold leading-snug">
                    {scheme.title}
                  </h3>

                  <p className="text-xs font-medium text-[#45617d]">
                    {scheme.ministry}
                  </p>

                  <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed line-clamp-3">
                    {scheme.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#c3c6ce]/20 mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onOpenSchemeModal(scheme)}
                    className="text-xs text-[#16324F] font-bold hover:text-[#C0392B] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Details</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={scheme.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#45617d] hover:text-[#16324F] flex items-center gap-1 font-medium"
                  >
                    <span>Official Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredSchemes.length === 0 && (
          <div className="text-center py-16 p-6 rounded-xl bg-white border border-[#c3c6ce]/30">
            <Layers className="w-10 h-10 text-[#74777e] mx-auto mb-2" />

            <h3 className="text-base font-bold text-[#001d37]">
              No government schemes found
            </h3>

            <p className="text-xs text-[#43474d] mt-1">
              Please clear search filters to view all available schemes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};