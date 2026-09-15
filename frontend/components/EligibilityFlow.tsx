import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  TrendingUp,
  GraduationCap,
  Award,
  MapPin,
  Briefcase,
  Edit2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  MoveHorizontal,
  HelpCircle,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';

// ── Notified PM Vishwakarma trades (18 official trades) ──────────────────────
const PM_VISHWAKARMA_TRADES = [
  'Carpenter (Suthar)',
  'Boat Maker',
  'Armourer',
  'Blacksmith (Lohar)',
  'Hammer and Tool Kit Maker',
  'Locksmith',
  'Goldsmith (Sonar)',
  'Potter (Kumhar)',
  'Sculptor / Stone Carver',
  'Cobbler / Shoesmith (Charmkar)',
  'Mason (Rajmistri)',
  'Basket Weaver / Mat Maker / Broom Maker / Coir Weaver',
  'Doll and Toy Maker (Traditional)',
  'Barber (Naai)',
  'Garland Maker (Malakaar)',
  'Washerman (Dhobi)',
  'Tailor (Darzi)',
  'Fishing Net Maker'
];

export const DOCUMENT_ICON_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1XjJy0ZFMDL-yt0lEu5IEIfpieXbQIREpF5ET0na0nSxhx5pCtu77lR_2Ch1ouup3IxuI26B8E-Gj65lq7btL3DCAe51Bt71tYgFdSXF5gnC17vyiKhDUg6JJeqGGjg83qKD23YWj1TfKfbUPIytC-41eQ7xl4GYTj6hA7aOWIW6ZOUpa1Db_GBsDU-7Q5w9v5P6PT5ZCLATL0xeSi6k8enCaVasmReifP85vrzBtwmt4aR_1W0UsZjHA';

interface EligibilityFlowProps {
  profile: UserProfile;
  isEvaluating?: boolean;
  onChangeProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onBackToHome: () => void;
  onSubmitEvaluation: () => void;
}

export const EligibilityFlow: React.FC<EligibilityFlowProps> = ({
  profile,
  isEvaluating = false,
  onChangeProfile,
  onBackToHome,
  onSubmitEvaluation
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchDeltaX, setTouchDeltaX] = useState(0);
  const [swipeToast, setSwipeToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const touchStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    isInput: boolean;
  }>({ x: 0, y: 0, time: 0, isInput: false });

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setSwipeToast(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setSwipeToast(null);
    }, 1800);
  };

  const goToStep = useCallback(
    (step: 1 | 2 | 3 | 4, direction?: 'next' | 'prev') => {
      const dir = direction || (step > currentStep ? 'next' : 'prev');
      setSlideDirection(dir);
      setCurrentStep(step);
      setIsSwiping(false);
      setTouchDeltaX(0);

      // Smoothly scroll to the top of the form for mobile citizens
      const flowElem = document.getElementById('eligibility-flow');
      if (flowElem) {
        flowElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    [currentStep]
  );

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const target = e.target as HTMLElement | null;
    const isInteractiveInput = !!target?.closest('input, select, textarea');

    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
      isInput: isInteractiveInput
    };
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartRef.current.isInput || e.touches.length !== 1) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const dx = currentX - touchStartRef.current.x;
    const dy = currentY - touchStartRef.current.y;

    // If vertical scrolling dominates, do not intercept
    if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 15) {
      if (isSwiping) {
        setIsSwiping(false);
        setTouchDeltaX(0);
      }
      return;
    }

    // If horizontal swipe is initiated
    if (Math.abs(dx) > 15 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      setIsSwiping(true);
      // Boundary resistance
      const atLeftBoundary = currentStep === 1 && dx > 0;
      const atRightBoundary = currentStep === 3 && dx < 0;
      const effectiveDx = atLeftBoundary || atRightBoundary ? dx * 0.2 : dx * 0.7;
      setTouchDeltaX(effectiveDx);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current.isInput) return;

    const dx = touchDeltaX;
    const dt = Date.now() - touchStartRef.current.time;
    const absDx = Math.abs(dx);

    if (isSwiping && absDx >= 45 && dt < 800) {
      if (dx < -45 && currentStep < 4) {
        // Swiped Left -> Next Step
        const next = (currentStep + 1) as 2 | 3 | 4;
        goToStep(next, 'next');
        const labels: Record<number, string> = {
          2: 'Swiped to Location & Profile',
          3: 'Swiped to Additional Details',
          4: 'Swiped to Review & Verify'
        };
        triggerToast(labels[next] ?? '');
      } else if (dx > 45 && currentStep > 1) {
        // Swiped Right -> Previous Step
        const prev = (currentStep - 1) as 1 | 2 | 3;
        goToStep(prev, 'prev');
        const labels: Record<number, string> = {
          1: 'Swiped back to Needs',
          2: 'Swiped back to Location & Profile',
          3: 'Swiped back to Additional Details'
        };
        triggerToast(labels[prev] ?? '');
      }
    }

    setIsSwiping(false);
    setTouchDeltaX(0);
  };

  const handleTouchCancel = () => {
    setIsSwiping(false);
    setTouchDeltaX(0);
  };

  const formatCurrency = (val: number) => {
    return '₹' + (isNaN(val) ? 0 : val).toLocaleString('en-IN');
  };

  const handleGoalSelect = (goal: UserProfile['supportGoal']) => {
    onChangeProfile((p) => ({ ...p, supportGoal: goal }));
  };

  const handleGenderSelect = (gender: UserProfile['gender']) => {
    onChangeProfile((p) => ({ ...p, gender }));
  };

  const handlePrioritySelect = (priorityCategory: 'Yes' | 'No') => {
    onChangeProfile((p) => ({ ...p, priorityCategory }));
  };

  const handleLocationTypeSelect = (locationType: UserProfile['locationType']) => {
    onChangeProfile((p) => ({ ...p, locationType }));
  };

  const handleSocialCategorySelect = (socialCategory: UserProfile['socialCategory']) => {
    onChangeProfile((p) => ({ ...p, socialCategory }));
  };

  const handleOccupationSelect = (occupation: UserProfile['occupation']) => {
    onChangeProfile((p) => ({ ...p, occupation }));
  };

  const handleBusinessTypeSelect = (businessType: UserProfile['businessType']) => {
    onChangeProfile((p) => ({ ...p, businessType }));
  };

  const handleBusinessStageSelect = (businessStage: UserProfile['businessStage']) => {
    onChangeProfile((p) => ({ ...p, businessStage }));
  };

  const isBusinessUser =
    profile.occupation === 'Aspiring Entrepreneur' ||
    profile.occupation === 'Business Owner' ||
    profile.supportGoal === 'New Business' ||
    profile.supportGoal === 'Expand Business';

  // Detect which scheme-specific sections are relevant
  const isFarmerProfile =
    profile.occupation === 'Farmer / Other' ||
    profile.supportGoal === 'Agriculture' ||
    profile.businessType === 'Agro-allied';

  const isPossibleArtisan =
    profile.occupation === 'Farmer / Other' ||
    profile.businessType === 'Manufacturing' ||
    profile.businessType === 'Service' ||
    profile.supportGoal === 'Skill Training';

  const isUrbanProfile =
    profile.locationType === 'Urban' ||
    profile.locationType === 'Semi-Urban';

  const isUrbanTrader =
    isUrbanProfile && (
      profile.businessType === 'Trading' ||
      profile.occupation === 'Business Owner' ||
      profile.occupation === 'Aspiring Entrepreneur'
    );

  const isScBusiness =
    profile.socialCategory === 'SC' && isBusinessUser;

  const isLargeProjectBusiness =
    isBusinessUser &&
    profile.projectCost >= 1_000_000 &&
    profile.projectCost <= 2_000_000;

  // Whether the additional details step has any questions to show
  const hasAdditionalDetails =
    isFarmerProfile ||
    isPossibleArtisan ||
    isUrbanTrader ||
    isScBusiness ||
    isUrbanProfile ||
    isBusinessUser ||
    isLargeProjectBusiness;

  return (
    <div id="eligibility-flow" className="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-[#fbf9f3] pb-16">
      {/* Flow Top Subheader / Breadcrumb Progress Bar */}
      <div className="w-full bg-[#f5f3ed] border-t border-b border-[#c3c6ce]/30 py-3">
        <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-[#45617d] tracking-wider">
              Step {currentStep} of 4
            </span>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Step 1 Tab */}
            <div
              onClick={() => goToStep(1)}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStep === 1
                  ? 'text-[#16324F] font-bold'
                  : currentStep > 1
                  ? 'text-[#2F6B4F] font-semibold'
                  : 'text-[#43474d] font-medium'
              }`}
              role="button"
              tabIndex={0}
              title="Go to Step 1"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  currentStep === 1
                    ? 'bg-[#16324F] text-white shadow-xs ring-2 ring-[#16324F]/20'
                    : currentStep > 1
                    ? 'bg-[#2F6B4F] text-white'
                    : 'bg-[#f0eee8] border border-[#c3c6ce]/60 text-[#43474d]'
                }`}
              >
                {currentStep > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span className="text-xs sm:text-sm tracking-tight hidden sm:inline">
                Personal
              </span>
            </div>

            <span className="text-[#c3c6ce] text-[14px]">―</span>

            {/* Step 2 Tab */}
            <div
              onClick={() => goToStep(2)}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStep === 2
                  ? 'text-[#16324F] font-bold'
                  : currentStep > 2
                  ? 'text-[#2F6B4F] font-semibold'
                  : 'text-[#43474d] font-medium'
              }`}
              role="button"
              tabIndex={0}
              title="Go to Step 2"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  currentStep === 2
                    ? 'bg-[#16324F] text-white shadow-xs ring-2 ring-[#16324F]/20'
                    : currentStep > 2
                    ? 'bg-[#2F6B4F] text-white'
                    : 'bg-[#f0eee8] border border-[#c3c6ce]/60 text-[#43474d]'
                }`}
              >
                {currentStep > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span className="text-xs sm:text-sm tracking-tight hidden sm:inline">
                Profile
              </span>
            </div>

            <span className="text-[#c3c6ce] text-[14px]">―</span>

            {/* Step 3 Tab */}
            <div
              onClick={() => goToStep(3)}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStep === 3
                  ? 'text-[#16324F] font-bold'
                  : currentStep > 3
                  ? 'text-[#2F6B4F] font-semibold'
                  : 'text-[#43474d] font-medium'
              }`}
              role="button"
              tabIndex={0}
              title="Go to Step 3"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  currentStep === 3
                    ? 'bg-[#16324F] text-white shadow-xs ring-2 ring-[#16324F]/20'
                    : currentStep > 3
                    ? 'bg-[#2F6B4F] text-white'
                    : 'bg-[#f0eee8] border border-[#c3c6ce]/60 text-[#43474d]'
                }`}
              >
                {currentStep > 3 ? <Check className="w-3.5 h-3.5" /> : '3'}
              </span>
              <span className="text-xs sm:text-sm tracking-tight hidden sm:inline">
                Details
              </span>
            </div>

            <span className="text-[#c3c6ce] text-[14px]">―</span>

            {/* Step 4 Tab */}
            <div
              onClick={() => goToStep(4)}
              className={`flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStep === 4
                  ? 'text-[#16324F] font-bold'
                  : 'text-[#43474d] font-medium'
              }`}
              role="button"
              tabIndex={0}
              title="Go to Step 4"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  currentStep === 4
                    ? 'bg-[#16324F] text-white shadow-xs ring-2 ring-[#16324F]/20'
                    : 'bg-[#f0eee8] border border-[#c3c6ce]/60 text-[#43474d]'
                }`}
              >
                4
              </span>
              <span className="text-xs sm:text-sm tracking-tight hidden sm:inline">
                Review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Citizen Swipe Navigation Helper Strip */}
      <div className="w-full bg-[#eae8e2]/80 border-b border-[#c3c6ce]/30 py-2 px-4 sm:hidden">
        <div className="flex items-center justify-between text-xs text-[#16324F]">
          <div className="flex items-center gap-1">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => goToStep((currentStep - 1) as 1 | 2 | 3, 'prev')}
                className="inline-flex items-center gap-1 font-semibold text-[#16324F] active:opacity-75 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Swipe Right</span>
              </button>
            ) : (
              <span className="text-[#43474d]/70 text-[11px] flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                <span>Swipe to Navigate</span>
              </span>
            )}
          </div>

          {/* Micro Dots */}
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep === s
                    ? 'w-4 bg-[#16324F]'
                    : 'w-1.5 bg-[#c3c6ce]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => goToStep((currentStep + 1) as 2 | 3 | 4, 'next')}
                className="inline-flex items-center gap-1 font-semibold text-[#16324F] active:opacity-75 cursor-pointer"
              >
                <span>Swipe Left</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-[#2F6B4F] font-bold text-[11px] flex items-center gap-0.5">
                Final Step ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Floating Real-time Swipe Feedback Overlay (Active during finger drag) */}
      {isSwiping && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all">
          <div className="px-4 py-1.5 rounded-full bg-[#001d37]/90 backdrop-blur-xs text-white text-xs font-bold shadow-lg border border-white/20 flex items-center gap-2">
            {touchDeltaX < -40 ? (
              <>
                <span>
                  {currentStep < 4
                    ? `Release to go to Step ${currentStep + 1}`
                    : 'Final review step'}
                </span>
                {currentStep < 4 && (
                  <ArrowRight className="w-3.5 h-3.5 text-[#5DCAA5]" />
                )}
              </>
            ) : touchDeltaX > 40 ? (
              <>
                {currentStep > 1 && (
                  <ArrowLeft className="w-3.5 h-3.5 text-[#5DCAA5]" />
                )}
                <span>
                  {currentStep > 1
                    ? `Release to go to Step ${currentStep - 1}`
                    : 'Initial step'}
                </span>
              </>
            ) : (
              <>
                <MoveHorizontal className="w-3.5 h-3.5 text-[#5DCAA5]" />
                <span>
                  Swipe {touchDeltaX < 0 ? 'left for next' : 'right for previous'}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Momentary Toast Notification following Swipe Navigation */}
      {swipeToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300"
        >
          <div className="px-4 py-2 rounded-full bg-[#16324F] text-white text-xs sm:text-sm font-semibold shadow-xl border border-white/10 flex items-center gap-2">
            <Check className="w-4 h-4 text-[#5DCAA5]" />
            <span>{swipeToast}</span>
          </div>
        </div>
      )}

      {/* Steps Body Container with Touch Swipe Listeners */}
      <div
        id="swipeable-step-container"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        className="max-w-5xl w-full mx-auto px-4 lg:px-10 pt-8 pb-16 touch-pan-y relative overflow-x-hidden"
        style={{
          transform: isSwiping ? `translateX(${touchDeltaX}px)` : 'translateX(0px)',
          transition: isSwiping ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: slideDirection === 'next' ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: slideDirection === 'next' ? -24 : 24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ================= STEP 1: Personal & Financial ================= */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Mobile Swipe Cue Banner */}
                <div className="flex sm:hidden items-center justify-between px-3 py-2 rounded-lg bg-[#eae8e2]/70 border border-[#c3c6ce]/40 text-xs text-[#16324F]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Smartphone className="w-3.5 h-3.5 text-[#2F6B4F]" />
                    <span>Swipe left to advance to Step 2</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#45617d]" />
                </div>
            {/* Trust & Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e2] text-[#2F6B4F] w-fit text-[11px] uppercase tracking-wider font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure • No Login Required</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl leading-none">📃</span>
                <h2 className="font-heading text-2xl sm:text-3xl text-[#16324F] font-bold tracking-tight">
                  Tell Us About Your Needs
                </h2>
              </div>
              <p className="text-base text-[#43474d] max-w-3xl leading-relaxed">
                Provide your requirement, venture, and household parameters to evaluate statutory scheme eligibility with zero data retention.
              </p>
            </div>

            {/* Form Card */}
            <div className="p-6 sm:p-8 rounded-xl bg-white shadow-xs space-y-6 border border-[#c3c6ce]/30">
              {/* Support For Option Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1b1c18] uppercase tracking-wider block">
                  What do you need support for?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleGoalSelect('New Business')}
                    className={`p-4 rounded-xl border text-sm sm:text-base font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      profile.supportGoal === 'New Business'
                        ? 'bg-[#16324F] text-white border-[#16324F]'
                        : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <span>New Business</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoalSelect('Expand Business')}
                    className={`p-4 rounded-xl border text-sm sm:text-base font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      profile.supportGoal === 'Expand Business'
                        ? 'bg-[#16324F] text-white border-[#16324F]'
                        : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Expand Business</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleGoalSelect('Education')}
                    className={`p-4 rounded-xl border text-sm sm:text-base font-semibold text-center transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                      profile.supportGoal === 'Education'
                        ? 'bg-[#16324F] text-white border-[#16324F]'
                        : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                    }`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>Education</span>
                  </button>
                </div>
              </div>

              {/* Financial Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#c3c6ce]/20">
                <div className="space-y-1.5">
                  <label htmlFor="input-project-cost" className="text-sm text-[#1b1c18] font-bold block">
                    Project / Course Cost (₹)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#43474d] font-bold text-lg">₹</span>
                    <input
                      type="number"
                      id="input-project-cost"
                      value={profile.projectCost || ''}
                      onChange={(e) =>
                        onChangeProfile((p) => ({
                          ...p,
                          projectCost: parseInt(e.target.value, 10) || 0
                        }))
                      }
                      placeholder="10,00,000"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F] focus:ring-1 focus:ring-[#16324F]"
                    />
                  </div>
                  <span className="text-xs text-[#43474d] block">
                    Enter expected initial capital outlay or educational fee.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-family-income" className="text-sm text-[#1b1c18] font-bold block">
                    Annual Family Income (₹)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-[#43474d] font-bold text-lg">₹</span>
                    <input
                      type="number"
                      id="input-family-income"
                      value={profile.familyIncome || ''}
                      onChange={(e) =>
                        onChangeProfile((p) => ({
                          ...p,
                          familyIncome: parseInt(e.target.value, 10) || 0
                        }))
                      }
                      placeholder="3,50,000"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F] focus:ring-1 focus:ring-[#16324F]"
                    />
                  </div>
                  <span className="text-xs text-[#43474d] block">
                    Determines gazetted means-tested subsidy brackets.
                  </span>
                </div>
              </div>

              {/* Applicant Age and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-[#c3c6ce]/20">
                <div className="space-y-1.5">
                  <label htmlFor="input-age" className="text-sm text-[#1b1c18] font-bold block">
                    Applicant Age
                  </label>
                  <input
                    type="number"
                    id="input-age"
                    min="16"
                    max="99"
                    value={profile.age || ''}
                    onChange={(e) =>
                      onChangeProfile((p) => ({
                        ...p,
                        age: parseInt(e.target.value, 10) || 0
                      }))
                    }
                    placeholder="29"
                    className="w-full px-4 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  />
                  <span className="text-xs text-[#43474d] block">
                    Age must be between 18 and 65 for <span className="font-semibold text-[#16324F]">enterprise credit</span> statutory evaluation.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#1b1c18] font-bold block">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Female', 'Male', 'Other'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleGenderSelect(g)}
                        className={`py-2.5 px-3 rounded-lg border text-sm font-semibold text-center transition-all cursor-pointer ${
                          profile.gender === g
                            ? 'bg-[#16324F] text-white border-[#16324F] shadow-xs'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-[#43474d] block">
                    Female applicants unlock dedicated affirmative subsidies.
                  </span>
                </div>
              </div>

              {/* Priority Category Question */}
              <div className="p-4 sm:p-5 rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-[#16324F] text-base font-bold">
                    <Award className="w-5 h-5 text-[#2F6B4F]" />
                    <span>Priority / Special Category Applicant</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#43474d] leading-relaxed">
                    Belong to Women Entrepreneurs, Divyangjan (PwD), Minority Communities, Ex-Servicemen, or aspirational district categories?
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handlePrioritySelect('Yes')}
                    className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                      profile.priorityCategory === 'Yes'
                        ? 'border-[#16324F] bg-[#16324F] text-white'
                        : 'border-[#c3c6ce]/60 bg-white text-[#1b1c18] hover:bg-[#eae8e2]'
                    }`}
                  >
                    {profile.priorityCategory === 'Yes' && <Check className="w-4 h-4" />}
                    <span>Yes</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrioritySelect('No')}
                    className={`inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                      profile.priorityCategory === 'No'
                        ? 'border-[#16324F] bg-[#16324F] text-white'
                        : 'border-[#c3c6ce]/60 bg-white text-[#1b1c18] hover:bg-[#eae8e2]'
                    }`}
                  >
                    {profile.priorityCategory === 'No' && <Check className="w-4 h-4" />}
                    <span>No</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 1 Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#16324F] bg-white text-[#16324F] text-sm font-bold hover:bg-[#16324F] hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(2, 'next')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-bold shadow-xs hover:bg-[#10243a] transition-all cursor-pointer"
              >
                <span>Continue to Profile</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: Location & Profile ================= */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Mobile Swipe Cue Banner */}
            <div className="flex sm:hidden items-center justify-between px-3 py-2 rounded-lg bg-[#eae8e2]/70 border border-[#c3c6ce]/40 text-xs text-[#16324F]">
              <div className="flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5 text-[#45617d]" />
                <span>Swipe right: Needs</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <span>Swipe left: Review</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#45617d]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e2] text-[#45617d] w-fit text-[11px] uppercase tracking-wider font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Jurisdiction &amp; Occupation</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-4xl sm:text-5xl leading-none">📃</span>
                <h2 className="font-heading text-2xl sm:text-3xl text-[#16324F] font-bold tracking-tight">
                  Tell Us About Your Profile
                </h2>
              </div>
              <p className="text-base text-[#43474d] max-w-3xl leading-relaxed">
                Central and state schemes offer targeted incentives based on state gazettes, rural zoning, and operational sector.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-xl bg-white shadow-xs space-y-6 border border-[#c3c6ce]/30">
              {/* Location Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="select-state" className="text-sm font-bold text-[#1b1c18] block">
                    State / Union Territory
                  </label>
                  <select
                    id="select-state"
                    value={profile.state}
                    onChange={(e) =>
                      onChangeProfile((p) => ({ ...p, state: e.target.value }))
                    }
                    className="w-full px-3.5 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  >
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Delhi (NCT)">Delhi (NCT)</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Assam">Assam</option>
                    <option value="All India">All India / Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-district" className="text-sm font-bold text-[#1b1c18] block">
                    District
                  </label>
                  <input
                    type="text"
                    id="input-district"
                    value={profile.district}
                    onChange={(e) =>
                      onChangeProfile((p) => ({ ...p, district: e.target.value }))
                    }
                    placeholder="e.g. Pune, Varanasi, Nagpur"
                    className="w-full px-3.5 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#1b1c18] block">Location Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Rural', 'Urban', 'Semi-Urban'] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => handleLocationTypeSelect(loc)}
                        className={`py-3 px-2 rounded-lg border text-sm font-semibold text-center transition-all cursor-pointer ${
                          profile.locationType === loc
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {loc === 'Semi-Urban' ? 'Semi' : loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Social / Applicant Category */}
              <div className="space-y-2 pt-2 border-t border-[#c3c6ce]/20">
                <label className="text-sm font-bold text-[#1b1c18] block">
                  Social / Reservation Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['General', 'OBC', 'SC', 'ST', 'Other'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleSocialCategorySelect(cat)}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-semibold text-center transition-all cursor-pointer ${
                        profile.socialCategory === cat
                          ? 'bg-[#16324F] text-white border-[#16324F]'
                          : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      {cat === 'Other' ? 'Other / EWS' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation Pills */}
              <div className="space-y-2 pt-2 border-t border-[#c3c6ce]/20">
                <label className="text-sm font-bold text-[#1b1c18] block">Primary Occupation</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      'Aspiring Entrepreneur',
                      'Business Owner',
                      'Student',
                      'Farmer / Other'
                    ] as const
                  ).map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => handleOccupationSelect(occ)}
                      className={`py-3 px-3 rounded-xl border text-sm font-semibold text-center transition-all truncate cursor-pointer ${
                        profile.occupation === occ
                          ? 'bg-[#16324F] text-white border-[#16324F]'
                          : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Business Details Sub-Panel */}
              {isBusinessUser && (
                <div className="space-y-4 pt-4 border-t border-[#c3c6ce]/20 bg-[#f5f3ed] p-4 sm:p-5 rounded-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-[#c3c6ce]/30">
                    <div className="flex items-center gap-2 text-[#16324F]">
                      <Briefcase className="w-5 h-5 text-[#2F6B4F]" />
                      <span className="text-base font-bold">Enterprise Parameters</span>
                    </div>
                    <span className="text-xs font-semibold text-[#45617d] uppercase tracking-wider">
                      MSMED Act (2006)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#16324F]">
                        Business Activity Type
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { val: 'Manufacturing', label: 'Manufacturing' },
                            { val: 'Service', label: 'Service Sector' },
                            { val: 'Trading', label: 'Trading / Retail' },
                            { val: 'Agro-allied', label: 'Agro-Processing' }
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => handleBusinessTypeSelect(item.val)}
                            className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold text-center transition-all cursor-pointer ${
                              profile.businessType === item.val
                                ? 'bg-[#16324F] text-white border-[#16324F]'
                                : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#eae8e2]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-[#16324F]">
                        Operational Stage &amp; Enterprise Turnover
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(
                          [
                            { val: 'New', label: 'New (Proposed)' },
                            { val: 'Existing', label: 'Existing Unit' }
                          ] as const
                        ).map((item) => (
                          <button
                            key={item.val}
                            type="button"
                            onClick={() => handleBusinessStageSelect(item.val)}
                            className={`py-2.5 px-3 rounded-lg border text-xs sm:text-sm font-semibold text-center transition-all cursor-pointer ${
                              profile.businessStage === item.val
                                ? 'bg-[#16324F] text-white border-[#16324F]'
                                : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#eae8e2]'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      <div className="pt-2 space-y-1">
                        <label htmlFor="input-turnover" className="block text-xs font-semibold text-[#43474d]">
                          Current Annual Turnover (₹) <span className="text-[11px] text-[#74777e] font-normal">(if operational)</span>
                        </label>
                        <input
                          type="number"
                          id="input-turnover"
                          value={profile.turnover || ''}
                          onChange={(e) =>
                            onChangeProfile((p) => ({
                              ...p,
                              turnover: parseInt(e.target.value, 10) || 0
                            }))
                          }
                          placeholder="0 if new enterprise"
                          className="w-full px-3.5 py-2 rounded-lg border border-[#c3c6ce]/60 bg-white text-sm text-[#1b1c18]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => goToStep(1, 'prev')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#16324F] bg-white text-[#16324F] text-sm font-bold hover:bg-[#16324F] hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Personal</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(3, 'next')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-bold shadow-xs hover:bg-[#10243a] transition-all cursor-pointer"
              >
                <span>Continue to Additional Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: Additional Details ================= */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Mobile Swipe Cue Banner */}
            <div className="flex sm:hidden items-center justify-between px-3 py-2 rounded-lg bg-[#eae8e2]/70 border border-[#c3c6ce]/40 text-xs text-[#16324F]">
              <div className="flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5 text-[#45617d]" />
                <span>Swipe right: Profile</span>
              </div>
              <div className="flex items-center gap-1 font-medium">
                <span>Swipe left: Review</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#45617d]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e2] text-[#45617d] w-fit text-[11px] uppercase tracking-wider font-bold">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Scheme-Specific Details</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={DOCUMENT_ICON_URL}
                  alt="Official Paper Document"
                  className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 object-contain shadow-xs rounded"
                />
                <h2 className="font-heading text-2xl sm:text-3xl text-[#16324F] font-bold tracking-tight">
                  Additional Eligibility Details
                </h2>
              </div>
              <p className="text-base text-[#43474d] max-w-3xl leading-relaxed">
                Based on your profile, some schemes require additional information to determine your eligibility accurately. Please answer only the questions that apply to you.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fef9e7] border border-[#f0d060]/50 text-xs text-[#856404]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>All questions on this page are optional, but unanswered questions may result in <strong>INSUFFICIENT INFORMATION</strong> status for relevant schemes.</span>
              </div>
            </div>

            {/* ─── Conditional Questions Panel ─── */}
            <div className="space-y-4">

              {/* PM-KISAN: Landholding status */}
              {isFarmerProfile && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">Agricultural Landholding Status</p>
                    <p className="text-xs text-[#43474d] mt-0.5">Required for PM-KISAN evaluation.</p>
                  </div>
                  <p className="text-sm text-[#1b1c18] font-semibold">Does your farmer family own or hold eligible agricultural land?</p>
                  <div className="flex gap-2">
                    {([true, false] as const).map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => onChangeProfile(p => ({ ...p, landholdingStatus: val }))}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                          profile.landholdingStatus === val
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onChangeProfile(p => ({ ...p, landholdingStatus: undefined }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        profile.landholdingStatus === undefined
                          ? 'bg-[#eae8e2] text-[#43474d] border-[#c3c6ce]'
                          : 'bg-white text-[#74777e] border-[#c3c6ce]/40 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                  <p className="text-sm font-bold text-[#16324F] mt-3">Are you or your household in an excluded category?</p>
                  <p className="text-[11px] text-[#74777e]">Excluded categories include income-tax payers, serving/retired government employees (except MTS/Class IV), constitutional post holders, and institutional landholders.</p>
                  <div className="flex gap-2">
                    {([true, false] as const).map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => onChangeProfile(p => ({ ...p, isExcludedFromPmKisan: val }))}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                          profile.isExcludedFromPmKisan === val
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {val ? 'Yes, I am excluded' : 'No, not excluded'}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onChangeProfile(p => ({ ...p, isExcludedFromPmKisan: undefined }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        profile.isExcludedFromPmKisan === undefined
                          ? 'bg-[#eae8e2] text-[#43474d] border-[#c3c6ce]'
                          : 'bg-white text-[#74777e] border-[#c3c6ce]/40 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              {/* PM Vishwakarma: Trade selection */}
              {isPossibleArtisan && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">PM Vishwakarma — Traditional Trade</p>
                    <p className="text-xs text-[#43474d] mt-0.5">PM Vishwakarma is only for artisans in one of 18 notified traditional trades. If you are not a traditional artisan, leave this blank.</p>
                  </div>
                  <label htmlFor="select-trade" className="text-sm font-semibold text-[#1b1c18] block">Select your traditional trade (if applicable):</label>
                  <select
                    id="select-trade"
                    value={profile.vishwakarmaTrade ?? ''}
                    onChange={e => onChangeProfile(p => ({ ...p, vishwakarmaTrade: e.target.value || undefined }))}
                    className="w-full px-3.5 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  >
                    <option value="">-- Not a traditional artisan / Skip --</option>
                    {PM_VISHWAKARMA_TRADES.map(trade => (
                      <option key={trade} value={trade}>{trade}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* PM SVANidhi: Street vendor status */}
              {isUrbanTrader && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">PM SVANidhi — Street Vendor Status</p>
                    <p className="text-xs text-[#43474d] mt-0.5">PM SVANidhi is exclusively for street vendors as defined under the Street Vendors Act, 2014. Fixed-premises shop owners do not qualify.</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1b1c18]">Are you a street vendor (vend from a cart, basket, stall, or public space without a fixed premises)?</p>
                  <div className="flex gap-2">
                    {([true, false] as const).map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => onChangeProfile(p => ({ ...p, isStreetVendor: val }))}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                          profile.isStreetVendor === val
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {val ? 'Yes, I am a street vendor' : 'No'}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onChangeProfile(p => ({ ...p, isStreetVendor: undefined }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        profile.isStreetVendor === undefined
                          ? 'bg-[#eae8e2] text-[#43474d] border-[#c3c6ce]'
                          : 'bg-white text-[#74777e] border-[#c3c6ce]/40 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                  {profile.isStreetVendor === true && (
                    <>
                      <p className="text-sm font-semibold text-[#1b1c18] mt-2">Do you hold a Certificate of Vending or Letter of Recommendation from your ULB / Town Vending Committee?</p>
                      <div className="flex gap-2">
                        {([true, false] as const).map(val => (
                          <button
                            key={String(val)}
                            type="button"
                            onClick={() => onChangeProfile(p => ({ ...p, hasVendorCertificate: val }))}
                            className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                              profile.hasVendorCertificate === val
                                ? 'bg-[#16324F] text-white border-[#16324F]'
                                : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                            }`}
                          >
                            {val ? 'Yes' : 'No'}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* CEGSSC: SC ownership percentage */}
              {isScBusiness && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">CEGSSC — SC Ownership Percentage</p>
                    <p className="text-xs text-[#43474d] mt-0.5">CEGSSC requires SC promoter to hold more than 51% ownership. Skip if not applicable.</p>
                  </div>
                  <label htmlFor="input-sc-ownership" className="text-sm font-semibold text-[#1b1c18] block">
                    SC promoter ownership percentage in the enterprise (%)
                  </label>
                  <input
                    type="number"
                    id="input-sc-ownership"
                    min="0"
                    max="100"
                    value={profile.scOwnershipPercent ?? ''}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      onChangeProfile(p => ({ ...p, scOwnershipPercent: isNaN(val) ? undefined : Math.min(100, Math.max(0, val)) }));
                    }}
                    placeholder="e.g. 75"
                    className="w-48 px-3.5 py-2.5 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  />
                </div>
              )}

              {/* PMAY-U 2.0: Pucca house status */}
              {isUrbanProfile && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">PMAY-U 2.0 — Housing Status</p>
                    <p className="text-xs text-[#43474d] mt-0.5">Required to evaluate PMAY-U 2.0 eligibility.</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1b1c18]">Does your household already own a pucca (permanent) house anywhere in India?</p>
                  <div className="flex gap-2">
                    {([true, false] as const).map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => onChangeProfile(p => ({ ...p, hasPuccaHouse: val }))}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                          profile.hasPuccaHouse === val
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onChangeProfile(p => ({ ...p, hasPuccaHouse: undefined }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        profile.hasPuccaHouse === undefined
                          ? 'bg-[#eae8e2] text-[#43474d] border-[#c3c6ce]'
                          : 'bg-white text-[#74777e] border-[#c3c6ce]/40 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              {/* PMEGP/General: Education qualification */}
              {isBusinessUser && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">Educational Qualification</p>
                    <p className="text-xs text-[#43474d] mt-0.5">Required for PMEGP projects above ₹10L (Manufacturing) or ₹5L (Service/Other).</p>
                  </div>
                  <label htmlFor="select-education" className="text-sm font-semibold text-[#1b1c18] block">Highest educational qualification:</label>
                  <select
                    id="select-education"
                    value={profile.educationQualification ?? ''}
                    onChange={e => onChangeProfile(p => ({
                      ...p,
                      educationQualification: (e.target.value || undefined) as UserProfile['educationQualification']
                    }))}
                    className="w-full max-w-xs px-3.5 py-3 rounded-lg border border-[#c3c6ce]/60 bg-white text-[#1b1c18] text-base focus:outline-hidden focus:border-[#16324F]"
                  >
                    <option value="">-- Skip / Not specified --</option>
                    <option value="Below VIII">Below VIII Standard</option>
                    <option value="VIII Pass">VIII Standard Pass</option>
                    <option value="X Pass">X Standard Pass (Matriculate)</option>
                    <option value="XII Pass">XII Standard Pass (Intermediate)</option>
                    <option value="Graduate">Graduate (Bachelor's Degree)</option>
                    <option value="Post Graduate">Post Graduate / Above</option>
                  </select>
                </div>
              )}

              {/* MUDRA Tarun Plus: Previous Tarun loan */}
              {isLargeProjectBusiness && (
                <div className="p-5 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs space-y-3">
                  <div>
                    <p className="text-sm font-bold text-[#16324F]">MUDRA Tarun Plus — Prior Loan History</p>
                    <p className="text-xs text-[#43474d] mt-0.5">Your project cost (₹10L–₹20L) falls under the Tarun Plus PMMY category. Tarun Plus requires a previously repaid Tarun loan.</p>
                  </div>
                  <p className="text-sm font-semibold text-[#1b1c18]">Have you previously taken a PMMY Tarun loan (₹5L–₹10L) and successfully repaid it?</p>
                  <div className="flex gap-2">
                    {([true, false] as const).map(val => (
                      <button
                        key={String(val)}
                        type="button"
                        onClick={() => onChangeProfile(p => ({ ...p, previousTarunLoan: val }))}
                        className={`px-5 py-2.5 rounded-lg border-2 text-sm font-semibold transition-all cursor-pointer ${
                          profile.previousTarunLoan === val
                            ? 'bg-[#16324F] text-white border-[#16324F]'
                            : 'bg-white text-[#1b1c18] border-[#c3c6ce]/60 hover:bg-[#f5f3ed]'
                        }`}
                      >
                        {val ? 'Yes' : 'No'}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => onChangeProfile(p => ({ ...p, previousTarunLoan: undefined }))}
                      className={`px-4 py-2.5 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                        profile.previousTarunLoan === undefined
                          ? 'bg-[#eae8e2] text-[#43474d] border-[#c3c6ce]'
                          : 'bg-white text-[#74777e] border-[#c3c6ce]/40 hover:bg-[#f5f3ed]'
                      }`}
                    >
                      Skip
                    </button>
                  </div>
                </div>
              )}

              {/* No additional questions message */}
              {!hasAdditionalDetails && (
                <div className="p-5 rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30 text-center">
                  <HelpCircle className="w-8 h-8 text-[#74777e] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#43474d]">No additional scheme-specific questions for your profile.</p>
                  <p className="text-xs text-[#74777e] mt-1">Proceed to review your answers.</p>
                </div>
              )}
            </div>

            {/* Step 3 Navigation */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => goToStep(2, 'prev')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#16324F] bg-white text-[#16324F] text-sm font-bold hover:bg-[#16324F] hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Profile</span>
              </button>
              <button
                type="button"
                onClick={() => goToStep(4, 'next')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-bold shadow-xs hover:bg-[#10243a] transition-all cursor-pointer"
              >
                <span>Continue to Review &amp; Verify</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: Review & Verify ================= */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Mobile Swipe Cue Banner */}
            <div className="flex sm:hidden items-center justify-between px-3 py-2 rounded-lg bg-[#eae8e2]/70 border border-[#c3c6ce]/40 text-xs text-[#16324F]">
              <div className="flex items-center gap-1 font-medium">
                <ArrowLeft className="w-3.5 h-3.5 text-[#45617d]" />
                <span>Swipe right: Additional Details</span>
              </div>
              <Smartphone className="w-3.5 h-3.5 text-[#2F6B4F]" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eae8e2] text-[#16324F] w-fit text-[11px] uppercase tracking-wider font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F6B4F]" />
                <span>Rule-Based Evaluation Ready</span>
              </div>
              <div className="flex items-center gap-3">
               <span className="text-4xl sm:text-5xl leading-none">📃</span>
                <h2 className="font-heading text-2xl sm:text-3xl text-[#16324F] font-bold tracking-tight">
                  Review Your Details
                </h2>
              </div>
              <p className="text-base text-[#43474d] max-w-3xl leading-relaxed">
                Verify your submitted parameters before evaluation. The engine checks conditions against documented scheme criteria.
              </p>
              <div className="flex items-start gap-2 p-3 rounded-lg bg-[#f0f4ff] border border-[#b0c0e0]/50 text-xs text-[#3a5a8c]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Rule-based eligibility guidance using documented scheme criteria. <strong>Final eligibility is determined by the relevant government authority</strong> and may require document or database verification.</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Section 1 Review: Personal Details */}
              <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#c3c6ce]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg text-[#16324F] font-bold">
                      Personal Details &amp; Category
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(1, 'prev')}
                    className="text-xs text-[#C0392B] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Age</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.age} Years</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Gender</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.gender}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Social Category</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.socialCategory}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Priority / Special</span>
                    <span className="font-bold text-[#2F6B4F] text-base mt-0.5 block">{profile.priorityCategory}</span>
                  </div>
                </div>
              </div>

              {/* Section 2 Review: Financial Details */}
              <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#c3c6ce]/20">
                  <span className="text-base sm:text-lg text-[#16324F] font-bold">Financial &amp; Capital Details</span>
                  <button type="button" onClick={() => goToStep(1, 'prev')} className="text-xs text-[#C0392B] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Support Goal</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.supportGoal}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Project / Course Cost</span>
                    <span className="font-bold text-[#16324F] text-base mt-0.5 block">{formatCurrency(profile.projectCost)}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Annual Family Income</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{formatCurrency(profile.familyIncome)}</span>
                  </div>
                </div>
              </div>

              {/* Section 3 Review: Location & Profile */}
              <div className="p-5 sm:p-6 rounded-xl bg-white border border-[#c3c6ce]/30 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#c3c6ce]/20">
                  <span className="text-base sm:text-lg text-[#16324F] font-bold">Location &amp; Enterprise Profile</span>
                  <button type="button" onClick={() => goToStep(2, 'prev')} className="text-xs text-[#C0392B] hover:underline font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">State &amp; District</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.state} ({profile.district || 'Any'})</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Area Type</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block">{profile.locationType}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Occupation</span>
                    <span className="font-bold text-[#1b1c18] text-base mt-0.5 block truncate">{profile.occupation}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#f5f3ed]">
                    <span className="text-[#43474d] block text-[11px] uppercase font-semibold">Enterprise Nature</span>
                    <span className="font-bold text-[#16324F] text-base mt-0.5 block truncate">{profile.businessType} ({profile.businessStage})</span>
                  </div>
                </div>
              </div>

              {/* Privacy Notice Banner */}
              <div className="p-4 rounded-xl bg-[#f5f3ed] border border-[#c3c6ce]/30 flex items-start gap-3 text-[#43474d] text-sm">
                <ShieldCheck className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#1b1c18]">Privacy &amp; Data Minimization:</span>
                  <span className="ml-1 leading-relaxed">
                    Your answers are processed entirely in browser memory. No names, phone numbers, or Aadhaar credentials are collected or stored.
                  </span>
                </div>
              </div>
            </div>

            {/* Step 4 Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => goToStep(3, 'prev')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-[#16324F] bg-white text-[#16324F] text-sm font-bold hover:bg-[#16324F] hover:text-white transition-all shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Additional Details</span>
              </button>
              <button
                type="button"
                disabled={isEvaluating}
                onClick={onSubmitEvaluation}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-[#16324F] text-white text-base font-bold shadow-md hover:bg-[#10243a] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isEvaluating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating Eligibility...</span>
                  </>
                ) : (
                  <>
                    <span>Submit &amp; Evaluate Eligibility</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
