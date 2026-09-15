import { useEffect, useRef, useCallback, RefObject, MutableRefObject } from 'react';

const PHRASES = [
  'Check your eligibility.',
  'Discover your benefits.',
  'Know your schemes.'
];

export interface UseHeroAnimationReturn {
  // DOM Refs for typing & headline
  typedTextRef: RefObject<HTMLSpanElement | null>;
  cursorRef: RefObject<HTMLSpanElement | null>;

  // DOM Refs for counters (Phase 2)
  schemesCountRef: RefObject<HTMLSpanElement | null>;
  parametersCountRef: RefObject<HTMLSpanElement | null>;
  matchedCountRef: RefObject<HTMLSpanElement | null>;

  // DOM Refs for right column demo (Phase 3, 4, 5)
  chipRefs: MutableRefObject<(HTMLSpanElement | null)[]>;
  ruleRowRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  rulesStatusRef: RefObject<HTMLSpanElement | null>;
  resultCardRef: RefObject<HTMLDivElement | null>;

  // Interaction trigger
  restart: () => void;
}

export function useHeroAnimation(): UseHeroAnimationReturn {
  // Phase 1 refs
  const typedTextRef = useRef<HTMLSpanElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);

  // Phase 2 refs
  const schemesCountRef = useRef<HTMLSpanElement | null>(null);
  const parametersCountRef = useRef<HTMLSpanElement | null>(null);
  const matchedCountRef = useRef<HTMLSpanElement | null>(null);

  // Phase 3, 4, 5 refs
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ruleRowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rulesStatusRef = useRef<HTMLSpanElement | null>(null);
  const resultCardRef = useRef<HTMLDivElement | null>(null);

  // Timing & execution control refs (No useState!)
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const animFramesRef = useRef<number[]>([]);
  const isCancelledRef = useRef<boolean>(false);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    animFramesRef.current.forEach((f) => cancelAnimationFrame(f));
    animFramesRef.current = [];
  }, []);

  // Helper to reset DOM nodes to initial state via direct DOM inline styles
  const resetDOM = useCallback(() => {
    // 1. Reset typed text
    if (typedTextRef.current) {
      typedTextRef.current.textContent = '';
    }

    // 2. Reset counters
    if (schemesCountRef.current) {
      schemesCountRef.current.textContent = '0+';
    }
    if (parametersCountRef.current) {
      parametersCountRef.current.textContent = '0';
    }
    if (matchedCountRef.current) {
      matchedCountRef.current.textContent = '0 matched';
    }

    // 3. Reset profile chips (Phase 3 chips — reset state)
    chipRefs.current.forEach((chip) => {
      if (chip) {
        chip.style.background = '#f5f3ed';
        chip.style.color = '#43474d';
        chip.style.borderColor = 'rgba(195,198,206,0.3)';
      }
    });

    // 4. Reset rule check rows (Phase 4 rule rows — hidden state)
    ruleRowRefs.current.forEach((row) => {
      if (row) {
        row.style.opacity = '0';
        row.style.transform = 'translateY(-4px)';
      }
    });
    if (rulesStatusRef.current) {
      rulesStatusRef.current.textContent = 'Checking criteria...';
      rulesStatusRef.current.style.color = '#45617d';
    }

    // 5. Reset result card (Phase 5 result card — hidden state)
    if (resultCardRef.current) {
      resultCardRef.current.style.opacity = '0';
      resultCardRef.current.style.transform = 'translateY(8px)';
      resultCardRef.current.style.border = '1px solid rgba(195,198,206,0.4)';
    }
  }, []);

  // Primary sequence execution
  const runSequence = useCallback(() => {
    isCancelledRef.current = false;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Show final state immediately without animation
      if (typedTextRef.current) {
        typedTextRef.current.textContent = PHRASES[0];
      }
      if (schemesCountRef.current) {
        schemesCountRef.current.textContent = '850+';
      }
      if (parametersCountRef.current) {
        parametersCountRef.current.textContent = '42';
      }
      if (matchedCountRef.current) {
        matchedCountRef.current.textContent = '5 matched';
      }
      chipRefs.current.forEach((chip) => {
        if (chip) {
          chip.style.background = '#112240';
          chip.style.color = '#ffffff';
          chip.style.borderColor = '#112240';
        }
      });
      ruleRowRefs.current.forEach((row) => {
        if (row) {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
          row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
      });
      if (rulesStatusRef.current) {
        rulesStatusRef.current.textContent = '● All checks passed';
        rulesStatusRef.current.style.color = '#1D9E75';
      }
      if (resultCardRef.current) {
        resultCardRef.current.style.opacity = '1';
        resultCardRef.current.style.transform = 'translateY(0)';
        resultCardRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resultCardRef.current.style.border = '2px solid #1D9E75';
      }
      return;
    }

    // ================= PHASE 1 (0ms): Typing effect =================
    // Type speed: 70ms/char, delete speed: 40ms/char, pause: 1800ms
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typeStep = () => {
      if (isCancelledRef.current) return;
      const currentPhrase = PHRASES[phraseIndex];

      if (!isDeleting) {
        // Forward typing at 70ms/char
        if (charIndex <= currentPhrase.length) {
          if (typedTextRef.current) {
            typedTextRef.current.textContent = currentPhrase.substring(0, charIndex);
          }
          charIndex++;
          const t = setTimeout(typeStep, 70);
          timersRef.current.push(t);
        } else {
          // Pause 1800ms before deleting
          const t = setTimeout(() => {
            isDeleting = true;
            typeStep();
          }, 1800);
          timersRef.current.push(t);
        }
      } else {
        // Backward deleting at 40ms/char
        if (charIndex > 0) {
          charIndex--;
          if (typedTextRef.current) {
            typedTextRef.current.textContent = currentPhrase.substring(0, charIndex);
          }
          const t = setTimeout(typeStep, 40);
          timersRef.current.push(t);
        } else {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % PHRASES.length;
          const t = setTimeout(typeStep, 250);
          timersRef.current.push(t);
        }
      }
    };

    typeStep();

    // ================= PHASE 2 (800ms): Counter animation =================
    // 850+ schemes, 42 rules, 5 matched — count up from 0 over 1200ms easeOut
    const counterTimer = setTimeout(() => {
      const startTime = performance.now();
      const duration = 1200; // 1200ms easeOut

      const animateCounters = (currentTime: number) => {
        if (isCancelledRef.current) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress * (2 - progress); // easeOutQuad

        if (schemesCountRef.current) {
          schemesCountRef.current.textContent = `${Math.floor(ease * 850)}+`;
        }
        if (parametersCountRef.current) {
          parametersCountRef.current.textContent = `${Math.floor(ease * 42)}`;
        }
        if (matchedCountRef.current) {
          matchedCountRef.current.textContent = `${Math.floor(ease * 5)} matched`;
        }

        if (progress < 1) {
          const id = requestAnimationFrame(animateCounters);
          animFramesRef.current.push(id);
        } else {
          if (schemesCountRef.current) schemesCountRef.current.textContent = '850+';
          if (parametersCountRef.current) parametersCountRef.current.textContent = '42';
          if (matchedCountRef.current) matchedCountRef.current.textContent = '5 matched';
        }
      };

      const id = requestAnimationFrame(animateCounters);
      animFramesRef.current.push(id);
    }, 800);
    timersRef.current.push(counterTimer);

    // ================= PHASE 3 (600ms): Profile chips activate one by one =================
    // Order: Age: 29 (600ms) → Female (900ms) → OBC (1200ms) → Maharashtra • Rural (1500ms) → New Business (1800ms)
    // Active state: background: '#112240', color: '#ffffff', borderColor: '#112240'
    [0, 1, 2, 3, 4].forEach((index) => {
      const t = setTimeout(() => {
        if (isCancelledRef.current) return;
        const chip = chipRefs.current[index];
        if (chip) {
          chip.style.background = '#112240';
          chip.style.color = '#ffffff';
          chip.style.borderColor = '#112240';
        }
      }, 600 + index * 300);
      timersRef.current.push(t);
    });

    // ================= PHASE 4 (1200ms): Rule check rows appear one by one =================
    // Every 400ms: 1200ms, 1600ms, 2000ms, 2400ms
    // After all 4: status label updates to "● 42 rules passed"
    [0, 1, 2, 3].forEach((index) => {
      const t = setTimeout(() => {
        if (isCancelledRef.current) return;
        const row = ruleRowRefs.current[index];
        if (row) {
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
          row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }
      }, 1200 + index * 400);
      timersRef.current.push(t);
    });

    // Status label updates after all 4 rows appear
    const statusTimer = setTimeout(() => {
      if (isCancelledRef.current) return;
      if (rulesStatusRef.current) {
        rulesStatusRef.current.textContent = '● All checks passed';
        rulesStatusRef.current.style.color = '#1D9E75';
      }
    }, 2450);
    timersRef.current.push(statusTimer);

    // ================= PHASE 5 (2200ms): Result card fades in =================
    const resultTimer = setTimeout(() => {
      if (isCancelledRef.current) return;

      if (resultCardRef.current) {
        resultCardRef.current.style.opacity = '1';
        resultCardRef.current.style.transform = 'translateY(0)';
        resultCardRef.current.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        resultCardRef.current.style.border = '2px solid #1D9E75';
      }
    }, 2200);
    timersRef.current.push(resultTimer);
  }, []);

  // Restart function on CTA click without triggering re-render of parent:
  // - Clear all pending timers first
  // - Reset all inline styles
  // - Re-run the sequence after 300ms
  // - NOT call any setState that triggers re-render of parent
  const restart = useCallback(() => {
    isCancelledRef.current = true;
    clearAllTimers();
    resetDOM();

    const restartTimer = setTimeout(() => {
      runSequence();
    }, 300);
    timersRef.current.push(restartTimer);
  }, [clearAllTimers, resetDOM, runSequence]);

  useEffect(() => {
    resetDOM();
    runSequence();

    return () => {
      isCancelledRef.current = true;
      clearAllTimers();
    };
  }, [resetDOM, runSequence, clearAllTimers]);

  return {
    typedTextRef,
    cursorRef,
    schemesCountRef,
    parametersCountRef,
    matchedCountRef,
    chipRefs,
    ruleRowRefs,
    rulesStatusRef,
    resultCardRef,
    restart
  };
}
