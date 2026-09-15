/**
 * SchemeSetu — Eligibility Rule Engine
 *
 * Design principles:
 * 1. Every mandatory criterion is either PASS, FAIL, or UNKNOWN.
 *    UNKNOWN (missing info) → INSUFFICIENT_INFORMATION or CONDITIONALLY_ELIGIBLE,
 *    never ELIGIBLE.
 * 2. A single FAIL on a mandatory criterion → NOT_ELIGIBLE.
 * 3. No arbitrary scores. relevanceScore is used only for sorting.
 * 4. No fallback. Zero matches is a valid result.
 * 5. Each scheme's logic is self-contained and testable in isolation.
 *
 * DISCLAIMER: This provides rule-based eligibility guidance using documented
 * scheme criteria. Final eligibility is determined by the relevant government
 * authority and may require document/database verification.
 */

import {
  UserProfile,
  Scheme,
  SchemeEligibilityResult,
  EligibilityStatus,
  CriterionResult,
  CriterionOutcome
} from '../types';

// ===========================================================================
// NAMED CONSTANTS — No magic numbers
// ===========================================================================

const PMEGP_MAX_PROJECT_MANUFACTURING = 5_000_000;  // ₹50 Lakh
const PMEGP_MAX_PROJECT_SERVICE       = 2_000_000;  // ₹20 Lakh
const PMEGP_EDUCATION_THRESHOLD_MFG   = 1_000_000;  // ₹10 Lakh
const PMEGP_EDUCATION_THRESHOLD_SVC   = 500_000;    // ₹5 Lakh

const MUDRA_SHISHU_MAX  = 50_000;
const MUDRA_KISHOR_MAX  = 500_000;
const MUDRA_TARUN_MAX   = 1_000_000;
const MUDRA_TARUN_PLUS_MAX = 2_000_000;

const PM_KISAN_ANNUAL_BENEFIT = 6_000;

const PMAY_U_EWS_INCOME_MAX = 300_000;   // ₹3 Lakh
const PMAY_U_LIG_INCOME_MAX = 600_000;   // ₹6 Lakh
const PMAY_U_MIG_INCOME_MAX = 1_800_000; // ₹18 Lakh

const POST_MATRIC_INCOME_MAX = 250_000;  // ₹2.5 Lakh

const CEGSSC_MIN_SC_OWNERSHIP_PERCENT = 51;

const PM_JAY_SENIOR_AGE_THRESHOLD = 70;  // 70+ senior citizen expansion

/**
 * The 18 notified traditional trades for PM Vishwakarma (as of 2023 launch).
 * Source: PM Vishwakarma Scheme Guidelines 2023, MoMSME.
 */
const PM_VISHWAKARMA_NOTIFIED_TRADES = new Set([
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
]);

// Education levels in ascending order for comparison
const EDUCATION_LEVEL_ORDER: UserProfile['educationQualification'][] = [
  'Below VIII',
  'VIII Pass',
  'X Pass',
  'XII Pass',
  'Graduate',
  'Post Graduate'
];

// ===========================================================================
// CRITERION BUILDER HELPERS
// ===========================================================================

function pass(id: string, description: string, explanation: string, mandatory: boolean): CriterionResult {
  return { id, description, outcome: 'PASS', mandatory, explanation };
}

function fail(id: string, description: string, explanation: string, mandatory: boolean): CriterionResult {
  return { id, description, outcome: 'FAIL', mandatory, explanation };
}

function unknown(id: string, description: string, explanation: string, mandatory: boolean): CriterionResult {
  return { id, description, outcome: 'UNKNOWN', mandatory, explanation };
}

// ===========================================================================
// STATUS CLASSIFICATION
// ===========================================================================

/**
 * Derives the EligibilityStatus from an array of evaluated criteria.
 *
 * Rules:
 * - Any mandatory FAIL → NOT_ELIGIBLE
 * - Any mandatory UNKNOWN (missing data) → at least INSUFFICIENT_INFORMATION
 *   (unless there's also a mandatory FAIL, which takes priority)
 * - Any soft/non-mandatory UNKNOWN → at least CONDITIONALLY_ELIGIBLE
 * - No FAILs, no UNKNOWNs → ELIGIBLE
 */
function deriveStatus(criteria: CriterionResult[]): EligibilityStatus {
  const hasMandatoryFail  = criteria.some(c => c.mandatory && c.outcome === 'FAIL');
  const hasMandatoryUnknown = criteria.some(c => c.mandatory && c.outcome === 'UNKNOWN');
  const hasSoftUnknown = criteria.some(c => !c.mandatory && c.outcome === 'UNKNOWN');

  if (hasMandatoryFail)    return 'NOT_ELIGIBLE';
  if (hasMandatoryUnknown) return 'INSUFFICIENT_INFORMATION';
  if (hasSoftUnknown)      return 'CONDITIONALLY_ELIGIBLE';
  return 'ELIGIBLE';
}

// ===========================================================================
// SCHEME RESULT BUILDER
// ===========================================================================

function buildResult(
  scheme: Scheme,
  criteria: CriterionResult[],
  statusSummary: string,
  benefitDescription: string,
  relevanceScore: number
): SchemeEligibilityResult {
  const status = deriveStatus(criteria);
  return {
    scheme,
    status,
    satisfiedCriteria:    criteria.filter(c => c.outcome === 'PASS'),
    failedCriteria:       criteria.filter(c => c.outcome === 'FAIL'),
    missingCriteria:      criteria.filter(c => c.outcome === 'UNKNOWN' && c.mandatory),
    verificationRequired: criteria.filter(c => c.outcome === 'UNKNOWN' && !c.mandatory),
    statusSummary,
    benefitDescription,
    relevanceScore
  };
}

// ===========================================================================
// EDUCATION QUALIFICATION HELPER
// ===========================================================================

function meetsEducationRequirement(
  profile: UserProfile,
  requiredLevel: UserProfile['educationQualification']
): CriterionOutcome {
  if (profile.educationQualification === undefined) return 'UNKNOWN';
  const actualIdx   = EDUCATION_LEVEL_ORDER.indexOf(profile.educationQualification);
  const requiredIdx = EDUCATION_LEVEL_ORDER.indexOf(requiredLevel);
  return actualIdx >= requiredIdx ? 'PASS' : 'FAIL';
}

// ===========================================================================
// SCHEME EVALUATORS
// ===========================================================================

// ---------------------------------------------------------------------------
// PMEGP
// ---------------------------------------------------------------------------
function evaluatePmegp(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isBusinessIntent =
    profile.supportGoal === 'New Business' ||
    profile.supportGoal === 'Expand Business' ||
    profile.occupation === 'Aspiring Entrepreneur' ||
    profile.occupation === 'Business Owner';

  if (!isBusinessIntent) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Minimum age 18
  criteria.push(
    profile.age >= 18
      ? pass('age', 'Minimum age 18 years', `Applicant is ${profile.age} years old.`, true)
      : fail('age', 'Minimum age 18 years', `Applicant is ${profile.age} — must be at least 18.`, true)
  );

  // MANDATORY: New enterprise only — existing businesses are NOT eligible for subsidy
  if (profile.businessStage === 'Existing') {
    criteria.push(
      fail(
        'new-enterprise',
        'Must be a newly established micro-enterprise',
        'PMEGP subsidy is only for new (proposed) enterprises. An existing enterprise is not eligible for the first-loan subsidy tranche.',
        true
      )
    );
  } else {
    criteria.push(
      pass(
        'new-enterprise',
        'Must be a newly established micro-enterprise',
        'Applicant indicates a new/proposed enterprise.',
        true
      )
    );
  }

  // MANDATORY: Project cost within applicable limit
  const isManufacturing = profile.businessType === 'Manufacturing';
  const maxCost = isManufacturing ? PMEGP_MAX_PROJECT_MANUFACTURING : PMEGP_MAX_PROJECT_SERVICE;
  const costLabel = isManufacturing ? '₹50 Lakh (Manufacturing)' : '₹20 Lakh (Service/Trading/Agro-allied)';

  if (profile.projectCost > maxCost) {
    criteria.push(
      fail(
        'project-cost',
        `Project cost within ${costLabel} limit`,
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} exceeds the ${costLabel} limit. Not eligible for PMEGP subsidy.`,
        true
      )
    );
  } else if (profile.projectCost <= 0) {
    criteria.push(
      unknown(
        'project-cost',
        `Project cost within ${costLabel} limit`,
        'Project cost has not been specified. Cannot evaluate cost eligibility.',
        true
      )
    );
  } else {
    criteria.push(
      pass(
        'project-cost',
        `Project cost within ${costLabel} limit`,
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} is within the ${costLabel} limit.`,
        true
      )
    );
  }

  // MANDATORY (conditional): VIII pass for manufacturing projects above ₹10L
  //                          or service projects above ₹5L
  const educationThreshold = isManufacturing ? PMEGP_EDUCATION_THRESHOLD_MFG : PMEGP_EDUCATION_THRESHOLD_SVC;
  const requiresEducation = profile.projectCost > educationThreshold;

  if (requiresEducation) {
    const eduOutcome = meetsEducationRequirement(profile, 'VIII Pass');
    if (eduOutcome === 'PASS') {
      criteria.push(
        pass(
          'education',
          'Minimum VIII standard pass (for projects above cost threshold)',
          `Applicant's qualification (${profile.educationQualification}) satisfies the VIII pass requirement.`,
          true
        )
      );
    } else if (eduOutcome === 'FAIL') {
      criteria.push(
        fail(
          'education',
          'Minimum VIII standard pass (for projects above cost threshold)',
          `Project cost exceeds ₹${educationThreshold.toLocaleString('en-IN')} and applicant has not passed VIII standard. Not eligible.`,
          true
        )
      );
    } else {
      criteria.push(
        unknown(
          'education',
          'Minimum VIII standard pass (for projects above cost threshold)',
          `Project cost exceeds ₹${educationThreshold.toLocaleString('en-IN')}. Educational qualification must be confirmed to determine eligibility.`,
          true
        )
      );
    }
  }

  // SOFT: Subsidy rate determination (location + special category)
  const isSpecialCategory =
    profile.gender === 'Female' ||
    profile.socialCategory === 'SC' ||
    profile.socialCategory === 'ST' ||
    profile.socialCategory === 'OBC' ||
    profile.priorityCategory === 'Yes';
  const isRural = profile.locationType === 'Rural' || profile.locationType === 'Semi-Urban';
  const subsidyRate = isSpecialCategory
    ? (isRural ? '35%' : '25%')
    : (isRural ? '25%' : '15%');

  criteria.push(
    pass(
      'location',
      'Location classification for subsidy rate',
      `${profile.locationType} location. Applicable subsidy rate: ${subsidyRate} (${isSpecialCategory ? 'Special category' : 'General category'}).`,
      false
    )
  );

  // Verification always required — EDP training, bank appraisal
  criteria.push(
    unknown(
      'edp-verification',
      'EDP training and lender appraisal',
      'Entrepreneurship Development Programme (EDP) training completion and lender credit appraisal are required before final approval.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = `Capital subsidy up to ${subsidyRate} of project cost — subject to EDP training and bank appraisal.`;

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failedNames = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failedNames}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'Profile appears compatible but educational qualification or other details need confirmation.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Profile matches key PMEGP criteria. EDP training and lender appraisal required before final approval.';
  } else {
    summary = 'Profile satisfies evaluated PMEGP criteria. EDP training and bank appraisal are the next steps.';
  }

  return buildResult(scheme, criteria, summary, benefit, isSpecialCategory ? 80 : 70);
}

// ---------------------------------------------------------------------------
// MUDRA / PMMY
// ---------------------------------------------------------------------------
function evaluateMudra(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isBusinessIntent =
    profile.supportGoal === 'New Business' ||
    profile.supportGoal === 'Expand Business' ||
    profile.occupation === 'Aspiring Entrepreneur' ||
    profile.occupation === 'Business Owner';

  if (!isBusinessIntent) return null;
  if (profile.age < 18) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Age ≥ 18
  criteria.push(
    pass('age', 'Applicant age 18 or above', `Applicant is ${profile.age} years old.`, true)
  );

  // MANDATORY: Non-farm business activity (can't confirm from profile alone — treat as soft unknown)
  criteria.push(
    pass(
      'non-farm',
      'Non-farm income generating activity',
      'Applicant has indicated a business/enterprise objective.',
      false
    )
  );

  // Determine applicable category
  let tier: string;
  let maxLoanText: string;

  if (profile.projectCost <= MUDRA_SHISHU_MAX) {
    tier = 'Shishu';
    maxLoanText = 'up to ₹50,000';
    criteria.push(
      pass('tier', 'Loan amount within PMMY category', `Project cost falls under Shishu category (${maxLoanText}).`, false)
    );
  } else if (profile.projectCost <= MUDRA_KISHOR_MAX) {
    tier = 'Kishore';
    maxLoanText = '₹50,000 to ₹5 Lakh';
    criteria.push(
      pass('tier', 'Loan amount within PMMY category', `Project cost falls under Kishore category (${maxLoanText}).`, false)
    );
  } else if (profile.projectCost <= MUDRA_TARUN_MAX) {
    tier = 'Tarun';
    maxLoanText = '₹5 Lakh to ₹10 Lakh';
    criteria.push(
      pass('tier', 'Loan amount within PMMY category', `Project cost falls under Tarun category (${maxLoanText}).`, false)
    );
  } else if (profile.projectCost <= MUDRA_TARUN_PLUS_MAX) {
    tier = 'Tarun Plus';
    maxLoanText = '₹10 Lakh to ₹20 Lakh';
    // Tarun Plus requires previous successful Tarun loan repayment
    if (profile.previousTarunLoan === true) {
      criteria.push(
        pass(
          'tarun-plus-history',
          'Previous Tarun loan successfully repaid (Tarun Plus requirement)',
          'Applicant confirms prior successful Tarun loan repayment — Tarun Plus may be applicable.',
          true
        )
      );
    } else if (profile.previousTarunLoan === false) {
      criteria.push(
        fail(
          'tarun-plus-history',
          'Previous Tarun loan successfully repaid (Tarun Plus requirement)',
          'Tarun Plus (₹10L–₹20L) requires a previously repaid Tarun loan. Applicant does not have this history. Loan amount exceeds standard PMMY limits.',
          true
        )
      );
    } else {
      criteria.push(
        unknown(
          'tarun-plus-history',
          'Previous Tarun loan successfully repaid (Tarun Plus requirement)',
          'The project amount (₹10L–₹20L) falls under Tarun Plus. Prior successful Tarun loan repayment is required — this information has not been provided.',
          true
        )
      );
    }
    criteria.push(
      pass('tier', 'Loan amount within Tarun Plus range', `Project cost falls under Tarun Plus category (${maxLoanText}).`, false)
    );
  } else {
    tier = 'Over Limit';
    criteria.push(
      fail(
        'tier',
        'Loan amount within PMMY limits (max ₹20 Lakh)',
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} exceeds the maximum PMMY limit of ₹20 Lakh.`,
        true
      )
    );
    maxLoanText = 'exceeds maximum limit';
  }

  // Lender appraisal always needed
  criteria.push(
    unknown(
      'lender-appraisal',
      'Lender credit appraisal and Udyam registration',
      'Final loan sanction is subject to lender assessment, clean credit history, and Udyam registration.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = tier !== 'Over Limit'
    ? `${tier} category: ${maxLoanText} — collateral-free, subject to lender appraisal`
    : 'Project cost exceeds PMMY limits';

  const summary = status === 'NOT_ELIGIBLE'
    ? `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} exceeds PMMY limits.`
    : status === 'INSUFFICIENT_INFORMATION'
    ? `Tarun Plus (₹10L–₹20L) requires confirmation of previous Tarun loan repayment history.`
    : `Profile matches PMMY ${tier} category. Lender appraisal required.`;

  return buildResult(scheme, criteria, summary, benefit, 70);
}

// ---------------------------------------------------------------------------
// PM Vishwakarma
// ---------------------------------------------------------------------------
function evaluateVishwakarma(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  // Only show for profiles that could plausibly be artisans
  const possibleArtisan =
    profile.occupation === 'Farmer / Other' ||
    profile.businessType === 'Manufacturing' ||
    profile.businessType === 'Service' ||
    profile.supportGoal === 'Skill Training';

  if (!possibleArtisan) return null;
  if (profile.age < 18) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Age ≥ 18
  criteria.push(
    pass('age', 'Minimum age 18 years', `Applicant is ${profile.age} years old.`, true)
  );

  // MANDATORY: Must practice one of the 18 notified traditional trades
  if (profile.vishwakarmaTrade === undefined) {
    criteria.push(
      unknown(
        'notified-trade',
        'Applicant must practice one of the 18 notified PM Vishwakarma traditional trades',
        'Trade information has not been provided. PM Vishwakarma is restricted to artisans and craftspeople engaged in notified traditional trades (e.g., Carpenter, Blacksmith, Potter, Goldsmith, Weaver). Please specify your trade.',
        true
      )
    );
  } else if (profile.vishwakarmaTrade === '') {
    criteria.push(
      unknown(
        'notified-trade',
        'Applicant must practice one of the 18 notified PM Vishwakarma traditional trades',
        'No trade has been selected. A specific notified trade must be identified.',
        true
      )
    );
  } else if (PM_VISHWAKARMA_NOTIFIED_TRADES.has(profile.vishwakarmaTrade)) {
    criteria.push(
      pass(
        'notified-trade',
        'Applicant must practice one of the 18 notified PM Vishwakarma traditional trades',
        `Trade "${profile.vishwakarmaTrade}" is a notified PM Vishwakarma trade.`,
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'notified-trade',
        'Applicant must practice one of the 18 notified PM Vishwakarma traditional trades',
        `"${profile.vishwakarmaTrade}" is not among the 18 notified PM Vishwakarma trades. Only the notified traditional trades qualify.`,
        true
      )
    );
  }

  // MANDATORY: Only one family member can register
  criteria.push(
    unknown(
      'single-family-member',
      'Only one member per family can be registered',
      'Verification that no other family member is already registered under PM Vishwakarma is required by the official portal.',
      false
    )
  );

  // SOFT: No similar government credit in last 5 years
  criteria.push(
    unknown(
      'no-prior-scheme-credit',
      'No credit availed under similar self-employment government schemes in past 5 years',
      'This requirement must be self-declared and verified at the time of registration.',
      false
    )
  );

  // Gram Panchayat / ULB verification always required
  criteria.push(
    unknown(
      'gp-ulb-verification',
      'Gram Panchayat / ULB trade verification',
      'Official verification of artisan trade by Gram Panchayat (rural) or Urban Local Body (urban) is required.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = 'Up to ₹3 Lakh concessional credit at 5% interest + ₹15,000 toolkit incentive + skill training';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    summary = `Not eligible: The specified trade is not among the 18 notified PM Vishwakarma trades.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'Trade information is required. PM Vishwakarma is only for artisans in notified traditional trades.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Trade appears eligible. Official trade verification by Gram Panchayat or ULB is required.';
  } else {
    summary = 'Profile satisfies evaluated criteria. Official registration and GP/ULB verification required.';
  }

  return buildResult(scheme, criteria, summary, benefit, 60);
}

// ---------------------------------------------------------------------------
// PM SVANidhi
// ---------------------------------------------------------------------------
function evaluateSvanidhi(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  // Only show for urban/semi-urban profiles with trading or small business
  const isUrban = profile.locationType === 'Urban' || profile.locationType === 'Semi-Urban';
  if (!isUrban) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Urban / semi-urban location
  criteria.push(
    pass(
      'urban-location',
      'Urban or Semi-Urban location',
      `Applicant is in a ${profile.locationType} area — PM SVANidhi applies to urban and peri-urban vendors.`,
      true
    )
  );

  // MANDATORY: Applicant must be a street vendor
  if (profile.isStreetVendor === undefined) {
    criteria.push(
      unknown(
        'street-vendor-status',
        'Applicant must be a street vendor as defined under the Street Vendors Act, 2014',
        'Street vendor status has not been confirmed. PM SVANidhi is exclusively for street vendors. An ordinary shop owner or business in a fixed premises does not qualify.',
        true
      )
    );
  } else if (profile.isStreetVendor === true) {
    criteria.push(
      pass(
        'street-vendor-status',
        'Applicant must be a street vendor as defined under the Street Vendors Act, 2014',
        'Applicant has confirmed street vendor status.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'street-vendor-status',
        'Applicant must be a street vendor as defined under the Street Vendors Act, 2014',
        'Applicant is not a street vendor. PM SVANidhi is only for street vendors. Fixed-premises shop owners and general traders do not qualify.',
        true
      )
    );
  }

  // SOFT: Vendor certificate / LoR (preferred but not always strictly required for first loan)
  if (profile.hasVendorCertificate === true) {
    criteria.push(
      pass(
        'vendor-certificate',
        'Certificate of Vending or Letter of Recommendation from ULB / Town Vending Committee',
        'Applicant holds a Certificate of Vending or Letter of Recommendation.',
        false
      )
    );
  } else if (profile.hasVendorCertificate === false) {
    criteria.push(
      unknown(
        'vendor-certificate',
        'Certificate of Vending or Letter of Recommendation from ULB / Town Vending Committee',
        'Vendor certificate/LoR not held. Eligibility for the initial ₹10,000 loan may still be possible via survey identification, but official ULB/TVC verification is required.',
        false
      )
    );
  } else {
    criteria.push(
      unknown(
        'vendor-certificate',
        'Certificate of Vending or Letter of Recommendation from ULB / Town Vending Committee',
        'Vendor certificate status not provided. ULB verification is required for loan processing.',
        false
      )
    );
  }

  // MANDATORY: Project/loan amount within PM SVANidhi limits
  if (profile.projectCost > 50_000) {
    criteria.push(
      fail(
        'loan-limit',
        'Loan requirement within PM SVANidhi limits (up to ₹50,000 in three tranches)',
        `The specified amount (₹${profile.projectCost.toLocaleString('en-IN')}) exceeds PM SVANidhi maximum loan of ₹50,000. This scheme provides escalating tranches of ₹10,000 → ₹20,000 → ₹50,000 subject to repayment.`,
        true
      )
    );
  } else {
    criteria.push(
      pass(
        'loan-limit',
        'Loan requirement within PM SVANidhi limits',
        'Loan requirement is within PM SVANidhi limits.',
        true
      )
    );
  }

  const status = deriveStatus(criteria);
  const benefit = '₹10,000 initial working capital loan (escalating to ₹50,000 on timely repayment) with 7% interest subsidy and digital cashback';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    summary = profile.isStreetVendor === false
      ? 'Not eligible: Applicant is not a street vendor. PM SVANidhi is exclusively for street vendors.'
      : 'Not eligible: Loan amount exceeds PM SVANidhi limits.';
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'Street vendor status must be confirmed. PM SVANidhi is exclusively for street vendors, not general traders.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Profile indicates street vendor status. Official ULB/TVC verification and vendor certificate required for loan processing.';
  } else {
    summary = 'Profile satisfies PM SVANidhi criteria. ULB verification and vendor certificate are the next steps.';
  }

  return buildResult(scheme, criteria, summary, benefit, 65);
}

// ---------------------------------------------------------------------------
// PM-KISAN
// ---------------------------------------------------------------------------
function evaluatePmKisan(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isFarmerProfile =
    profile.supportGoal === 'Agriculture' ||
    profile.occupation === 'Farmer / Other' ||
    profile.businessType === 'Agro-allied';

  if (!isFarmerProfile) return null;

  const criteria: CriterionResult[] = [];

  // SOFT: Farmer / agricultural occupation identified
  criteria.push(
    pass(
      'farmer-profile',
      'Agriculture / farming profile',
      'Applicant profile indicates agricultural activity.',
      false
    )
  );

  // MANDATORY: Must own or hold eligible agricultural land
  if (profile.landholdingStatus === undefined) {
    criteria.push(
      unknown(
        'landholding',
        'Eligible agricultural landholding (individual or co-owned)',
        'Landholding status has not been provided. PM-KISAN requires the applicant\'s farmer family to hold eligible agricultural land. This information is required to determine eligibility.',
        true
      )
    );
  } else if (profile.landholdingStatus === true) {
    criteria.push(
      pass(
        'landholding',
        'Eligible agricultural landholding (individual or co-owned)',
        'Applicant confirms agricultural landholding.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'landholding',
        'Eligible agricultural landholding (individual or co-owned)',
        'Applicant does not hold eligible agricultural land. PM-KISAN income support is for landholding farmer families.',
        true
      )
    );
  }

  // MANDATORY: Not excluded under PM-KISAN exclusion criteria
  if (profile.isExcludedFromPmKisan === undefined) {
    criteria.push(
      unknown(
        'exclusion-check',
        'Not excluded under PM-KISAN exclusion categories',
        'PM-KISAN excludes certain categories including: income-tax payers, current/former constitutional post holders, serving/retired government employees (except Class IV/Multi-Tasking Staff), and institutional landholders. Exclusion status has not been confirmed.',
        true
      )
    );
  } else if (profile.isExcludedFromPmKisan === false) {
    criteria.push(
      pass(
        'exclusion-check',
        'Not excluded under PM-KISAN exclusion categories',
        'Applicant confirms they are not in an excluded category.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'exclusion-check',
        'Not excluded under PM-KISAN exclusion categories',
        'Applicant or their household falls under one or more PM-KISAN exclusion categories. Not eligible.',
        true
      )
    );
  }

  // Official beneficiary verification always required
  criteria.push(
    unknown(
      'pm-kisan-database',
      'Beneficiary registration in PM-KISAN official database',
      'Final eligibility and payment disbursement requires registration and verification through the official PM-KISAN portal (pmkisan.gov.in). Land records must be verified by the State/UT government.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = '₹6,000 per year in three equal installments of ₹2,000 directly to bank account';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failedNames = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failedNames}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'Landholding status and exclusion category information are required to evaluate PM-KISAN eligibility.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Profile appears compatible. Official beneficiary verification through pm kisan.gov.in is required.';
  } else {
    summary = 'Profile satisfies evaluated criteria. Official beneficiary registration and state verification are the next steps.';
  }

  return buildResult(scheme, criteria, summary, benefit, 75);
}

// ---------------------------------------------------------------------------
// AIF
// ---------------------------------------------------------------------------
function evaluateAif(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isAgriIntent =
    profile.supportGoal === 'Agriculture' ||
    profile.businessType === 'Agro-allied' ||
    profile.occupation === 'Farmer / Other';

  if (!isAgriIntent) return null;

  const criteria: CriterionResult[] = [];

  criteria.push(
    pass(
      'agri-sector',
      'Agriculture / agro-processing sector activity',
      'Profile indicates agricultural or agro-allied activity.',
      false
    )
  );

  // AIF is for PACS, FPOs, SHGs, agri-entrepreneurs, co-ops etc. — not purely individual farmers
  criteria.push(
    unknown(
      'eligible-entity',
      'Eligible entity type (FPO, co-op, agri-entrepreneur, SHG, startup)',
      'AIF is available to farmers, FPOs, cooperatives, SHGs, agri-entrepreneurs, and startups for eligible post-harvest infrastructure. The specific project type and applicant entity must be confirmed.',
      true
    )
  );

  criteria.push(
    unknown(
      'infrastructure-project',
      'Eligible post-harvest infrastructure project (warehouse, cold chain, primary processing)',
      'AIF funds eligible post-harvest management assets. The specific project must be confirmed as an eligible infrastructure type.',
      true
    )
  );

  criteria.push(
    unknown(
      'dpr-bank-appraisal',
      'Detailed Project Report and lender appraisal',
      'A DPR and lender credit appraisal are required for AIF financing.',
      false
    )
  );

  const status = deriveStatus(criteria);
  return buildResult(
    scheme,
    criteria,
    'Agriculture profile detected. AIF eligibility depends on the specific project type, entity structure, and post-harvest infrastructure focus.',
    '3% interest subvention on eligible loans up to ₹2 Crore for post-harvest infrastructure',
    65
  );
}

// ---------------------------------------------------------------------------
// CEGSSC
// ---------------------------------------------------------------------------
function evaluateCegssc(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isBusiness =
    profile.supportGoal === 'New Business' ||
    profile.supportGoal === 'Expand Business' ||
    profile.occupation === 'Aspiring Entrepreneur' ||
    profile.occupation === 'Business Owner';

  if (!isBusiness) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: SC social category
  if (profile.socialCategory === 'SC') {
    criteria.push(
      pass(
        'sc-category',
        'Applicant / promoter belongs to Scheduled Caste',
        'Applicant is SC category.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'sc-category',
        'Applicant / promoter belongs to Scheduled Caste',
        `Applicant is ${profile.socialCategory}. CEGSSC is exclusively for Scheduled Caste (SC) entrepreneurs.`,
        true
      )
    );
  }

  // MANDATORY: SC promoter must hold > 51% ownership
  if (profile.scOwnershipPercent === undefined) {
    criteria.push(
      unknown(
        'sc-ownership',
        'SC promoter holds more than 51% ownership in the enterprise',
        'Ownership percentage has not been provided. CEGSSC requires that the SC promoter(s) hold more than 51% shareholding and management control for a minimum of 6 months before application.',
        true
      )
    );
  } else if (profile.scOwnershipPercent > CEGSSC_MIN_SC_OWNERSHIP_PERCENT) {
    criteria.push(
      pass(
        'sc-ownership',
        'SC promoter holds more than 51% ownership in the enterprise',
        `SC promoter ownership (${profile.scOwnershipPercent}%) exceeds the required 51% threshold.`,
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'sc-ownership',
        'SC promoter holds more than 51% ownership in the enterprise',
        `SC promoter ownership (${profile.scOwnershipPercent}%) is at or below the required 51% minimum. CEGSSC requires >51% SC promoter shareholding.`,
        true
      )
    );
  }

  // SOFT: 6-month minimum ownership duration — cannot be verified without date
  criteria.push(
    unknown(
      'ownership-duration',
      'SC promoter ownership for at least 6 months before application',
      'Ownership duration cannot be verified from the profile. The 6-month prior ownership requirement must be confirmed through enterprise registration documents.',
      false
    )
  );

  // SC certificate verification
  criteria.push(
    unknown(
      'sc-certificate',
      'Valid SC certificate from competent state revenue authority',
      'A valid SC caste certificate issued by the competent state authority is required.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = 'Credit guarantee support (100% for loans up to ₹1 Crore; graded cover up to ₹5 Crore) — collateral-free institutional lending';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failed = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failed}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'SC ownership percentage must be provided. CEGSSC requires >51% SC promoter ownership.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Ownership criteria appear to be met. Ownership duration (6 months) and SC certificate require official verification.';
  } else {
    summary = 'Profile satisfies evaluated CEGSSC criteria. Lending institution and NSCFDC verification required.';
  }

  return buildResult(scheme, criteria, summary, benefit, 70);
}

// ---------------------------------------------------------------------------
// Post-Matric Scholarship for Scheduled Castes
// ---------------------------------------------------------------------------
function evaluatePostMatricScholarship(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isStudentProfile =
    profile.supportGoal === 'Education' ||
    profile.occupation === 'Student';

  if (!isStudentProfile) return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: SC category — this is a scheme specifically for SC students
  if (profile.socialCategory === 'SC') {
    criteria.push(
      pass(
        'sc-category',
        'Applicant belongs to Scheduled Caste (scheme is SC-specific)',
        'Applicant is SC category — satisfies the mandatory category requirement.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'sc-category',
        'Applicant belongs to Scheduled Caste (scheme is SC-specific)',
        `Applicant is ${profile.socialCategory}. The Post-Matric Scholarship for Scheduled Castes (Ministry of Social Justice & Empowerment) is specifically for SC students. Applicants of other categories are not eligible for this particular scheme.`,
        true
      )
    );
  }

  // MANDATORY: Family income ≤ ₹2.5 Lakh
  if (profile.familyIncome <= 0) {
    criteria.push(
      unknown(
        'income-limit',
        'Annual family income not exceeding ₹2,50,000',
        'Family income has not been specified.',
        true
      )
    );
  } else if (profile.familyIncome <= POST_MATRIC_INCOME_MAX) {
    criteria.push(
      pass(
        'income-limit',
        'Annual family income not exceeding ₹2,50,000',
        `Annual family income ₹${profile.familyIncome.toLocaleString('en-IN')} is within the ₹2.5 Lakh limit.`,
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'income-limit',
        'Annual family income not exceeding ₹2,50,000',
        `Annual family income ₹${profile.familyIncome.toLocaleString('en-IN')} exceeds the ₹2.5 Lakh limit. Not eligible.`,
        true
      )
    );
  }

  // MANDATORY: Must be enrolled in a post-matric recognized course
  criteria.push(
    unknown(
      'course-enrollment',
      'Enrolled in recognized post-matriculation course / institution',
      'Course enrollment and institution recognition cannot be verified from the profile. The student must be enrolled in an eligible recognized post-matric course.',
      true
    )
  );

  // SOFT: Age range (typically post-matric students are 16–35)
  if (profile.age < 16 || profile.age > 40) {
    criteria.push(
      unknown(
        'age-range',
        'Age appropriate for post-matric study',
        `Age ${profile.age} is outside the typical range for post-matric education. Course and institution verification may clarify.`,
        false
      )
    );
  } else {
    criteria.push(
      pass(
        'age-range',
        'Age appropriate for post-matric study',
        `Age ${profile.age} is within appropriate range for post-matric education.`,
        false
      )
    );
  }

  const status = deriveStatus(criteria);
  const benefit = 'Full tuition fee reimbursement + monthly maintenance allowance — paid directly to student account via NSP';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failed = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failed}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'SC status confirmed. Course enrollment and institution recognition need verification.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Profile appears compatible. Course enrollment and institution details must be verified through National Scholarship Portal.';
  } else {
    summary = 'Profile satisfies evaluated criteria. Apply through the National Scholarship Portal (scholarships.gov.in).';
  }

  return buildResult(scheme, criteria, summary, benefit, profile.socialCategory === 'SC' ? 80 : 20);
}

// ---------------------------------------------------------------------------
// Mission Shakti
// ---------------------------------------------------------------------------
function evaluateMissionShakti(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  if (profile.gender !== 'Female') return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Female gender
  criteria.push(
    pass(
      'gender',
      'Female applicant',
      'Mission Shakti targets women beneficiaries.',
      true
    )
  );

  // SOFT: Age ≥ 18
  if (profile.age >= 18) {
    criteria.push(
      pass('age', 'Age 18 or above', `Applicant is ${profile.age} years old.`, false)
    );
  } else {
    criteria.push(
      unknown('age', 'Age 18 or above', `Applicant is ${profile.age}. Age eligibility depends on specific Mission Shakti component.`, false)
    );
  }

  // SOFT: Mission Shakti is an umbrella programme — the specific component
  // and its conditions can only be determined by the implementing authority
  criteria.push(
    unknown(
      'component-identification',
      'Applicable Mission Shakti component and its specific eligibility conditions',
      'Mission Shakti is an umbrella programme with components including Sambal (safety/security) and Samarthya (empowerment/economic). The specific component applicable to this profile and its eligibility conditions must be determined by the implementing authority.',
      false
    )
  );

  // Always CONDITIONALLY_ELIGIBLE for women — never claim full eligibility without component
  const benefit = 'Varies by component — may include micro-credit, skill training, SHG support, One Stop Centre access, or institutional grants';
  const summary = 'Female profile identified. Mission Shakti has multiple components. The applicable component and its specific eligibility conditions must be determined through the implementing authority (Ministry of Women & Child Development / State WCD).';

  return buildResult(scheme, criteria, summary, benefit, 60);
}

// ---------------------------------------------------------------------------
// PMAY-U 2.0
// ---------------------------------------------------------------------------
function evaluatePmayU2(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  // Only relevant for urban locations
  if (profile.locationType !== 'Urban') return null;

  const criteria: CriterionResult[] = [];

  // MANDATORY: Urban location
  criteria.push(
    pass('urban', 'Urban location (PMAY-U applies to urban areas)', 'Applicant is in an urban area.', true)
  );

  // MANDATORY: Income within PMAY-U 2.0 bands (EWS/LIG/MIG)
  let incomeLabel = '';
  let incomePass = false;
  if (profile.familyIncome <= 0) {
    criteria.push(
      unknown('income-band', 'Household income within applicable PMAY-U 2.0 income band (EWS/LIG/MIG)', 'Annual household income not specified.', true)
    );
  } else if (profile.familyIncome <= PMAY_U_EWS_INCOME_MAX) {
    incomeLabel = `EWS (up to ₹3 Lakh)`;
    incomePass = true;
    criteria.push(pass('income-band', 'Household income within applicable PMAY-U 2.0 income band', `Income ₹${profile.familyIncome.toLocaleString('en-IN')} qualifies as EWS (up to ₹3 Lakh).`, true));
  } else if (profile.familyIncome <= PMAY_U_LIG_INCOME_MAX) {
    incomeLabel = `LIG (₹3L–₹6L)`;
    incomePass = true;
    criteria.push(pass('income-band', 'Household income within applicable PMAY-U 2.0 income band', `Income ₹${profile.familyIncome.toLocaleString('en-IN')} qualifies as LIG (₹3–₹6 Lakh).`, true));
  } else if (profile.familyIncome <= PMAY_U_MIG_INCOME_MAX) {
    incomeLabel = `MIG (₹6L–₹18L)`;
    incomePass = true;
    criteria.push(pass('income-band', 'Household income within applicable PMAY-U 2.0 income band', `Income ₹${profile.familyIncome.toLocaleString('en-IN')} qualifies as MIG (₹6–₹18 Lakh).`, true));
  } else {
    criteria.push(fail(
      'income-band',
      'Household income within applicable PMAY-U 2.0 income band (max ₹18 Lakh for MIG)',
      `Annual household income ₹${profile.familyIncome.toLocaleString('en-IN')} exceeds the MIG ceiling of ₹18 Lakh. Not eligible for PMAY-U 2.0.`,
      true
    ));
  }

  // MANDATORY: No pucca house anywhere in India
  if (profile.hasPuccaHouse === undefined) {
    criteria.push(
      unknown(
        'no-pucca-house',
        'Applicant / household must not own a pucca house anywhere in India',
        'Whether the household owns a pucca house has not been confirmed. This is a mandatory PMAY-U 2.0 condition — households already owning a pucca house are not eligible.',
        true
      )
    );
  } else if (profile.hasPuccaHouse === false) {
    criteria.push(
      pass(
        'no-pucca-house',
        'Applicant / household must not own a pucca house anywhere in India',
        'Applicant confirms they do not own a pucca house.',
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'no-pucca-house',
        'Applicant / household must not own a pucca house anywhere in India',
        'Applicant already owns a pucca house. Not eligible for PMAY-U 2.0 under the main verticals.',
        true
      )
    );
  }

  // Soft: No prior government housing assistance
  criteria.push(
    unknown(
      'no-prior-housing',
      'Household has not previously received central government housing assistance',
      'Prior housing scheme benefit receipt must be verified at the time of application.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = incomePass
    ? `Housing assistance for ${incomeLabel} households — includes interest subsidy and/or capital subsidy depending on PMAY-U 2.0 vertical`
    : 'Not applicable — income exceeds PMAY-U 2.0 limits';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failed = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failed}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = `Urban profile and income (${incomeLabel || 'unspecified'}) detected. The no-pucca-house condition must be confirmed.`;
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = `Profile satisfies income and location criteria (${incomeLabel}). Prior housing assistance verification required.`;
  } else {
    summary = `Profile satisfies evaluated criteria. Final eligibility under the applicable PMAY-U 2.0 vertical is subject to official verification.`;
  }

  return buildResult(scheme, criteria, summary, benefit, incomePass ? 70 : 30);
}

// ---------------------------------------------------------------------------
// PM-JAY / Ayushman Bharat
// ---------------------------------------------------------------------------
function evaluatePmJay(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  // PM-JAY is relevant to almost everyone — but the eligibility pathways differ significantly
  const criteria: CriterionResult[] = [];
  let pathway = '';

  // PATHWAY 1: Age 70+ senior citizen expansion (AB PMJAY-Senior)
  // This pathway is independent of income and social category
  if (profile.age >= PM_JAY_SENIOR_AGE_THRESHOLD) {
    pathway = '70+ Senior Citizen';
    criteria.push(
      pass(
        'senior-age',
        'Age 70 or above (senior citizen expansion pathway)',
        `Applicant is ${profile.age} years old — potentially eligible under the Ayushman Bharat PM-JAY Senior Citizen expansion (AB PMJAY-70+) regardless of income or social category.`,
        true
      )
    );
    // Official enrolment/verification always required
    criteria.push(
      unknown(
        'pmjay-senior-verification',
        'Official PM-JAY senior citizen beneficiary registration',
        'Eligibility under the 70+ expansion requires verification through the official Ayushman Bharat portal. The applicant and/or their family members can check eligibility and generate an Ayushman card at pmjay.gov.in.',
        false
      )
    );
  } else {
    // PATHWAY 2: General PM-JAY eligibility
    // This is based on SECC-2011 / other database criteria — cannot be definitively
    // verified from a self-reported questionnaire alone
    pathway = 'General';

    criteria.push(
      unknown(
        'pmjay-database',
        'Inclusion in PM-JAY beneficiary database (SECC-2011 or state-designated list)',
        'PM-JAY general eligibility is determined through the SECC-2011 database and state-designated beneficiary lists, not self-reported income or category alone. Beneficiary status must be verified through the official PM-JAY portal (pmjay.gov.in).',
        true
      )
    );
  }

  const status = deriveStatus(criteria);
  const benefit = 'Health cover of up to ₹5 Lakh per family per year for secondary and tertiary hospitalization at empanelled hospitals — cashless treatment';

  let summary: string;
  if (pathway === '70+ Senior Citizen') {
    summary = `Applicant is ${profile.age} years old and may be eligible under the PM-JAY 70+ Senior Citizen expansion regardless of income or social category. Official verification at pmjay.gov.in is required.`;
  } else {
    summary = 'PM-JAY eligibility is determined through the SECC-2011 beneficiary database and official verification, not income alone. Check eligibility at pmjay.gov.in.';
  }

  return buildResult(scheme, criteria, summary, benefit, profile.age >= PM_JAY_SENIOR_AGE_THRESHOLD ? 80 : 55);
}

// ---------------------------------------------------------------------------
// Stand-Up India
// ---------------------------------------------------------------------------
function evaluateStandupIndia(scheme: Scheme, profile: UserProfile): SchemeEligibilityResult | null {
  const isBusiness =
    profile.supportGoal === 'New Business' ||
    profile.occupation === 'Aspiring Entrepreneur' ||
    profile.occupation === 'Business Owner';

  if (!isBusiness) return null;

  const isScStOrWoman =
    profile.socialCategory === 'SC' ||
    profile.socialCategory === 'ST' ||
    profile.gender === 'Female';

  const criteria: CriterionResult[] = [];

  // MANDATORY: SC, ST, or Woman applicant
  if (isScStOrWoman) {
    criteria.push(
      pass(
        'sc-st-woman',
        'Applicant is SC, ST, or Woman entrepreneur',
        `Applicant is ${profile.socialCategory} / ${profile.gender} — qualifies as SC/ST or Woman beneficiary.`,
        true
      )
    );
  } else {
    criteria.push(
      fail(
        'sc-st-woman',
        'Applicant is SC, ST, or Woman entrepreneur',
        `Stand-Up India requires the applicant to be SC, ST, or a woman. Applicant is ${profile.socialCategory} / ${profile.gender}.`,
        true
      )
    );
  }

  // MANDATORY: Greenfield (new) enterprise
  if (profile.businessStage === 'Existing') {
    criteria.push(
      fail(
        'greenfield',
        'Greenfield (first-time) enterprise',
        'Stand-Up India is for greenfield enterprises (first time venture). Existing enterprises do not qualify.',
        true
      )
    );
  } else {
    criteria.push(
      pass(
        'greenfield',
        'Greenfield (first-time) enterprise',
        'Applicant indicates a new/proposed enterprise.',
        true
      )
    );
  }

  // MANDATORY: Age ≥ 18
  criteria.push(
    profile.age >= 18
      ? pass('age', 'Age 18 or above', `Applicant is ${profile.age} years old.`, true)
      : fail('age', 'Age 18 or above', `Applicant is ${profile.age} — must be at least 18.`, true)
  );

  // MANDATORY: Loan amount ₹10L–₹1 Crore
  if (profile.projectCost < 1_000_000) {
    criteria.push(
      fail(
        'loan-range',
        'Loan requirement between ₹10 Lakh and ₹1 Crore',
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} is below the Stand-Up India minimum loan of ₹10 Lakh. Consider MUDRA/PMMY instead.`,
        true
      )
    );
  } else if (profile.projectCost > 10_000_000) {
    criteria.push(
      fail(
        'loan-range',
        'Loan requirement between ₹10 Lakh and ₹1 Crore',
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} exceeds the Stand-Up India maximum of ₹1 Crore.`,
        true
      )
    );
  } else {
    criteria.push(
      pass(
        'loan-range',
        'Loan requirement between ₹10 Lakh and ₹1 Crore',
        `Project cost ₹${profile.projectCost.toLocaleString('en-IN')} is within the Stand-Up India loan range.`,
        true
      )
    );
  }

  // Soft: No default on any bank/FI
  criteria.push(
    unknown(
      'no-default',
      'No default on any bank or financial institution',
      'Clean credit history must be confirmed through the lender and credit bureau.',
      false
    )
  );

  const status = deriveStatus(criteria);
  const benefit = 'Composite bank loan of ₹10 Lakh to ₹1 Crore (75% of project cost with minimum 10–15% own contribution)';

  let summary: string;
  if (status === 'NOT_ELIGIBLE') {
    const failed = criteria.filter(c => c.outcome === 'FAIL' && c.mandatory).map(c => c.description).join('; ');
    summary = `Not eligible: ${failed}.`;
  } else if (status === 'INSUFFICIENT_INFORMATION') {
    summary = 'Profile appears compatible. Official lender verification required.';
  } else if (status === 'CONDITIONALLY_ELIGIBLE') {
    summary = 'Profile matches Stand-Up India criteria. Lender appraisal and credit verification required.';
  } else {
    summary = 'Profile satisfies evaluated Stand-Up India criteria. Apply through standupmitra.in.';
  }

  return buildResult(scheme, criteria, summary, benefit, isScStOrWoman ? 75 : 20);
}

// ===========================================================================
// SCHEME DISPATCHER — maps scheme ID to evaluator function
// ===========================================================================

type SchemeEvaluator = (scheme: Scheme, profile: UserProfile) => SchemeEligibilityResult | null;

const SCHEME_EVALUATORS: Record<string, SchemeEvaluator> = {
  'pmegp':                  evaluatePmegp,
  'mudra':                  evaluateMudra,
  'pm-vishwakarma':         evaluateVishwakarma,
  'svanidhi':               evaluateSvanidhi,
  'pm-kisan':               evaluatePmKisan,
  'aif':                    evaluateAif,
  'cegssc':                 evaluateCegssc,
  'post-matric-scholarship': evaluatePostMatricScholarship,
  'mission-shakti':         evaluateMissionShakti,
  'pmay-u-2':               evaluatePmayU2,
  'pm-jay':                 evaluatePmJay,
  'standup':                evaluateStandupIndia,
};

// ===========================================================================
// INPUT VALIDATION / CONTRADICTION DETECTION
// ===========================================================================

export interface ProfileValidationError {
  field: string;
  message: string;
}

export function validateProfile(profile: UserProfile): ProfileValidationError[] {
  const errors: ProfileValidationError[] = [];

  if (profile.age < 0 || profile.age > 120) {
    errors.push({ field: 'age', message: `Age ${profile.age} is not a plausible value.` });
  }
  if (profile.age < 16 && profile.occupation === 'Business Owner') {
    errors.push({ field: 'occupation', message: 'Age below 16 is inconsistent with Business Owner occupation.' });
  }
  if (profile.age < 18 && profile.businessStage === 'Existing') {
    errors.push({ field: 'businessStage', message: 'Age below 18 with an existing business is an unusual combination.' });
  }
  if (profile.familyIncome < 0) {
    errors.push({ field: 'familyIncome', message: 'Family income cannot be negative.' });
  }
  if (profile.projectCost < 0) {
    errors.push({ field: 'projectCost', message: 'Project cost cannot be negative.' });
  }
  // Street vendor contradiction
  if (profile.isStreetVendor === false && profile.hasVendorCertificate === true) {
    errors.push({
      field: 'isStreetVendor',
      message: 'Contradictory inputs: "Not a street vendor" but holds a vendor certificate.'
    });
  }

  return errors;
}

// ===========================================================================
// MAIN EXPORT — evaluateEligibility
// ===========================================================================

/**
 * Evaluates a user profile against all available schemes.
 *
 * Returns only schemes for which an evaluator exists AND the scheme is
 * contextually relevant to the profile.
 *
 * NOT_ELIGIBLE results are included — the UI decides whether to show them.
 * If zero schemes match, returns an empty array (no fallback).
 *
 * Profile validation errors are surfaced separately and do not prevent
 * evaluation — but callers should display them.
 */
export function evaluateEligibility(
  profile: UserProfile,
  schemes: Scheme[]
): SchemeEligibilityResult[] {
  const results: SchemeEligibilityResult[] = [];

  for (const scheme of schemes) {
    const evaluator = SCHEME_EVALUATORS[scheme.id];
    if (!evaluator) {
      // No evaluator implemented for this scheme — skip silently
      // (the scheme still appears in the repository view)
      continue;
    }

    const result = evaluator(scheme, profile);
    if (result !== null) {
      results.push(result);
    }
  }

  // Sort: ELIGIBLE → CONDITIONALLY_ELIGIBLE → INSUFFICIENT_INFORMATION → NOT_ELIGIBLE
  // Within each group, sort by relevanceScore descending
  const STATUS_ORDER: Record<EligibilityStatus, number> = {
    'ELIGIBLE': 0,
    'CONDITIONALLY_ELIGIBLE': 1,
    'INSUFFICIENT_INFORMATION': 2,
    'NOT_ELIGIBLE': 3
  };

  results.sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    return b.relevanceScore - a.relevanceScore;
  });

  // NO FALLBACK — if results is empty, that is a valid, honest outcome.
  return results;
}
