export type Language = 'en' | 'hi';

export type AppView = 'landing' | 'flow' | 'results' | 'schemes' | 'transparency';

// ---------------------------------------------------------------------------
// Eligibility status — four distinct states, never collapsed into a single
// "match" value. These are the ONLY valid outputs of the rule engine.
// ---------------------------------------------------------------------------
export type EligibilityStatus =
  | 'ELIGIBLE'               // All mandatory criteria the system can evaluate are satisfied
  | 'CONDITIONALLY_ELIGIBLE' // Profile appears compatible but one+ criteria need verification
  | 'NOT_ELIGIBLE'           // At least one mandatory criterion is explicitly failed
  | 'INSUFFICIENT_INFORMATION'; // Required fields are missing to make any determination

// ---------------------------------------------------------------------------
// Result of evaluating a single eligibility criterion
// ---------------------------------------------------------------------------
export type CriterionOutcome = 'PASS' | 'FAIL' | 'UNKNOWN';

export interface CriterionResult {
  id: string;
  description: string;
  outcome: CriterionOutcome;
  mandatory: boolean;
  /** User-facing explanation of why it passed/failed/is unknown */
  explanation: string;
}

// ---------------------------------------------------------------------------
// Full result object for a single scheme — replaces the old SchemeMatch
// ---------------------------------------------------------------------------
export interface SchemeEligibilityResult {
  scheme: Scheme;
  status: EligibilityStatus;
  /** Criteria that evaluated to PASS */
  satisfiedCriteria: CriterionResult[];
  /** Criteria that evaluated to FAIL (mandatory failure → NOT_ELIGIBLE) */
  failedCriteria: CriterionResult[];
  /** Criteria that evaluated to UNKNOWN because the required profile field was not provided */
  missingCriteria: CriterionResult[];
  /** Criteria that can only be checked by an official authority */
  verificationRequired: CriterionResult[];
  /** Human-readable summary of why this status was reached */
  statusSummary: string;
  /** Benefit description — never claims to be guaranteed */
  benefitDescription: string;
  /** Profile-relevance score used only for sorting (0–100); never shown as eligibility % */
  relevanceScore: number;
}

// ---------------------------------------------------------------------------
// Extended user profile — includes fields needed for scheme-specific rules
// New fields are optional (undefined means "not asked yet" / unknown)
// ---------------------------------------------------------------------------
export interface UserProfile {
  // Step 1 — needs & finances
  supportGoal: 'New Business' | 'Expand Business' | 'Education' | 'Agriculture' | 'Skill Training';
  projectCost: number;
  familyIncome: number;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  /** Whether the applicant belongs to an affirmative-action special category */
  priorityCategory: 'Yes' | 'No';

  // Step 2 — location & profile
  state: string;
  district: string;
  locationType: 'Rural' | 'Urban' | 'Semi-Urban';
  socialCategory: 'General' | 'OBC' | 'SC' | 'ST' | 'Other';
  occupation: 'Aspiring Entrepreneur' | 'Business Owner' | 'Student' | 'Farmer / Other';
  businessType: 'Manufacturing' | 'Service' | 'Trading' | 'Agro-allied';
  businessStage: 'New' | 'Existing';
  turnover: number;

  // --------------------------------------------------------------------------
  // Conditional fields — collected dynamically when a relevant scheme is
  // detected based on the core profile above. undefined = not yet asked.
  // --------------------------------------------------------------------------

  /**
   * PM-KISAN: Does the applicant own/hold eligible agricultural land?
   * undefined = not yet asked; true = yes; false = no
   */
  landholdingStatus?: boolean;

  /**
   * PM-KISAN: Is the applicant or their household excluded from PM-KISAN?
   * Covers income-tax payers, government employees, constitutional post holders,
   * institutional landholders, etc.
   * undefined = not yet asked; true = YES excluded; false = NOT excluded
   */
  isExcludedFromPmKisan?: boolean;

  /**
   * PM Vishwakarma: The specific traditional trade the applicant practices.
   * Must be one of the 18 notified trades to pass the trade criterion.
   * undefined = not asked; '' or a non-notified value = insufficient info
   */
  vishwakarmaTrade?: string;

  /**
   * PM SVANidhi: Is the applicant a street vendor (as defined by the Street
   * Vendors (Protection of Livelihood and Regulation of Street Vending) Act, 2014)?
   * undefined = not asked; true = yes; false = no
   */
  isStreetVendor?: boolean;

  /**
   * PM SVANidhi: Does the applicant hold a Certificate of Vending or Letter
   * of Recommendation from a ULB / Town Vending Committee?
   * undefined = not asked
   */
  hasVendorCertificate?: boolean;

  /**
   * CEGSSC: The SC promoter's ownership percentage in the enterprise.
   * undefined = not asked
   */
  scOwnershipPercent?: number;

  /**
   * PMAY-U 2.0: Does the applicant/household already own a pucca house anywhere in India?
   * undefined = not asked; true = yes (disqualifies for most verticals);
   * false = no (required for most verticals)
   */
  hasPuccaHouse?: boolean;

  /**
   * PMEGP / general: Highest educational qualification.
   * Determines whether VIII pass requirement for manufacturing >₹10L is satisfied.
   */
  educationQualification?:
    | 'Below VIII'
    | 'VIII Pass'
    | 'X Pass'
    | 'XII Pass'
    | 'Graduate'
    | 'Post Graduate';

  /**
   * MUDRA Tarun Plus: Has the applicant previously taken a Tarun loan and
   * successfully repaid it?
   * undefined = not asked
   */
  previousTarunLoan?: boolean;
}

// ---------------------------------------------------------------------------
// Scheme data model — as served from the backend / local data
// ---------------------------------------------------------------------------
export interface Scheme {
  id: string;
  title: string;
  shortName: string;
  ministry: string;
  category: 'MSME' | 'Agriculture' | 'Social' | 'Education';
  sectorType: 'Central Sector' | 'Centrally Sponsored' | 'Priority Banking' | 'Credit Guarantee';
  benefitHeadline: string;
  maxCeilingText: string;
  description: string;
  statutoryClause: string;
  officialPortalUrl: string;
  objectives: string;
  eligibilityParameters: string[];
  requiredDocuments: string[];
  // Optional structured rule parameters (used by the engine as hints/display)
  minAge?: number;
  maxAge?: number;
  allowedOccupations?: string[];
  allowedCategories?: string[];
  allowedGenders?: string[];
  maxIncome?: number;
  maxProjectCost?: number;
}

// ---------------------------------------------------------------------------
// Legacy alias — kept so any code still using SchemeMatch continues to compile.
// New code should use SchemeEligibilityResult.
// ---------------------------------------------------------------------------
export type SchemeMatch = SchemeEligibilityResult;
