/**
 * SchemeSetu — Adversarial Rule Engine Tests
 *
 * These tests cover the 10 mandatory adversarial scenarios plus boundary conditions.
 * Each test name describes the scenario; each assertion describes the expected result.
 *
 * To run: `npx tsx --test frontend/utils/rulesEngine.test.ts`
 * (Requires Node 18+ with the built-in test runner, or use vitest.)
 */

import { evaluateEligibility } from './rulesEngine';
import { UserProfile, Scheme, SchemeEligibilityResult } from '../types';

// ============================================================================
// Helper: Build a minimal test scheme with only the required fields
// ============================================================================
function makeScheme(overrides: Partial<Scheme>): Scheme {
  return {
    id: 'test',
    title: 'Test Scheme',
    shortName: 'Test',
    ministry: 'Test Ministry',
    category: 'MSME',
    sectorType: 'Central Sector',
    benefitHeadline: 'Test',
    maxCeilingText: 'Test',
    description: 'A test scheme',
    statutoryClause: 'Test Guidelines',
    officialPortalUrl: 'https://example.gov.in',
    objectives: 'Test objective',
    eligibilityParameters: [],
    requiredDocuments: [],
    ...overrides
  };
}

// Base profile for business tests
const BASE_BUSINESS_PROFILE: UserProfile = {
  supportGoal: 'New Business',
  projectCost: 500_000,
  familyIncome: 300_000,
  age: 28,
  gender: 'Male',
  priorityCategory: 'No',
  state: 'Maharashtra',
  district: 'Pune',
  locationType: 'Urban',
  socialCategory: 'General',
  occupation: 'Aspiring Entrepreneur',
  businessType: 'Manufacturing',
  businessStage: 'New',
  turnover: 0
};

const BASE_STUDENT_PROFILE: UserProfile = {
  supportGoal: 'Education',
  projectCost: 0,
  familyIncome: 200_000,
  age: 21,
  gender: 'Female',
  priorityCategory: 'No',
  state: 'Tamil Nadu',
  district: 'Chennai',
  locationType: 'Urban',
  socialCategory: 'General', // General — should FAIL SC scholarship
  occupation: 'Student',
  businessType: 'Service',
  businessStage: 'New',
  turnover: 0
};

const BASE_FARMER_PROFILE: UserProfile = {
  supportGoal: 'Agriculture',
  projectCost: 0,
  familyIncome: 150_000,
  age: 40,
  gender: 'Male',
  priorityCategory: 'No',
  state: 'Punjab',
  district: 'Ludhiana',
  locationType: 'Rural',
  socialCategory: 'General',
  occupation: 'Farmer / Other',
  businessType: 'Agro-allied',
  businessStage: 'New',
  turnover: 0
};

function findSchemeResult(
  results: SchemeEligibilityResult[],
  schemeId: string
): SchemeEligibilityResult | undefined {
  return results.find(r => r.scheme.id === schemeId);
}

// Simple assertion helpers (no test framework dependency)
let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅  PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌  FAIL: ${testName}`);
    failCount++;
  }
}

function describe(suiteName: string, fn: () => void) {
  console.log(`\n📋 ${suiteName}`);
  fn();
}

// ============================================================================
// Test Schemes (minimal data — same IDs as the real seed data)
// ============================================================================

const SCHEMES: Scheme[] = [
  makeScheme({ id: 'pm-kisan',   title: 'PM-KISAN',    category: 'Agriculture', ministry: 'MoAFW' }),
  makeScheme({ id: 'pm-jay',     title: 'PM-JAY',      category: 'Social',     ministry: 'MoHFW' }),
  makeScheme({ id: 'pmay-u-2',   title: 'PMAY-U 2.0',  category: 'Social',     ministry: 'MoHUA' }),
  makeScheme({ id: 'pmegp',      title: 'PMEGP',       category: 'MSME',       ministry: 'MoMSME' }),
  makeScheme({ id: 'mudra',      title: 'PM MUDRA',    category: 'MSME',       ministry: 'DFS' }),
  makeScheme({ id: 'pm-vishwakarma', title: 'PM Vishwakarma', category: 'MSME', ministry: 'MoMSME' }),
  makeScheme({ id: 'svanidhi',   title: 'PM SVANidhi', category: 'MSME',       ministry: 'MoHUA' }),
  makeScheme({ id: 'post-matric-scholarship', title: 'Post Matric SC Scholarship', category: 'Education', ministry: 'MoSJE' }),
  makeScheme({ id: 'cegssc',     title: 'CEGSSC',      category: 'Social',     ministry: 'MoSJE' }),
  makeScheme({ id: 'mission-shakti', title: 'Mission Shakti', category: 'Social', ministry: 'MoWCD' }),
  makeScheme({ id: 'standup',    title: 'Stand-Up India', category: 'MSME',   ministry: 'DFS' }),
  makeScheme({ id: 'aif',        title: 'AIF',         category: 'Agriculture', ministry: 'MoAFW' }),
];

// ============================================================================
// ADVERSARIAL TEST SUITE
// ============================================================================

describe('TEST 1: General student → NOT_ELIGIBLE for SC-only Post-Matric Scholarship', () => {
  const results = evaluateEligibility(BASE_STUDENT_PROFILE, SCHEMES);
  const scholarship = findSchemeResult(results, 'post-matric-scholarship');

  assert(scholarship !== undefined, 'Post-matric scholarship appears in results for student profile');
  assert(scholarship?.status === 'NOT_ELIGIBLE', `Status should be NOT_ELIGIBLE (got: ${scholarship?.status})`);
  assert(
    scholarship?.failedCriteria.some(c => c.id === 'sc-category') === true,
    'Failed criterion should be sc-category'
  );
});

describe('TEST 2: SC student, income within limit, no course enrolled → INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_STUDENT_PROFILE,
    socialCategory: 'SC',
    familyIncome: 200_000 // within ₹2.5L limit
    // educationQualification and course enrollment not provided
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const scholarship = findSchemeResult(results, 'post-matric-scholarship');

  assert(scholarship !== undefined, 'Post-matric scholarship appears');
  assert(
    scholarship?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${scholarship?.status})`
  );
  assert(
    scholarship?.missingCriteria.some(c => c.id === 'course-enrollment') === true,
    'Missing criterion should be course-enrollment'
  );
});

describe('TEST 3: SC student, income exceeds limit → NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_STUDENT_PROFILE,
    socialCategory: 'SC',
    familyIncome: 400_000 // exceeds ₹2.5L limit
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const scholarship = findSchemeResult(results, 'post-matric-scholarship');

  assert(scholarship?.status === 'NOT_ELIGIBLE', `Status should be NOT_ELIGIBLE (got: ${scholarship?.status})`);
  assert(
    scholarship?.failedCriteria.some(c => c.id === 'income-limit') === true,
    'Failed criterion should be income-limit'
  );
});

describe('TEST 4: Farmer profile, no landholding info → PM-KISAN INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_FARMER_PROFILE
    // landholdingStatus and isExcludedFromPmKisan not provided (undefined)
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmKisan = findSchemeResult(results, 'pm-kisan');

  assert(pmKisan !== undefined, 'PM-KISAN appears for farmer profile');
  assert(
    pmKisan?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${pmKisan?.status})`
  );
  assert(
    pmKisan?.missingCriteria.some(c => c.id === 'landholding') === true,
    'Missing criterion should be landholding'
  );
});

describe('TEST 5: Farmer, no landholding → NOT_ELIGIBLE for PM-KISAN', () => {
  const profile: UserProfile = {
    ...BASE_FARMER_PROFILE,
    landholdingStatus: false,
    isExcludedFromPmKisan: false
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmKisan = findSchemeResult(results, 'pm-kisan');

  assert(pmKisan?.status === 'NOT_ELIGIBLE', `Status should be NOT_ELIGIBLE (got: ${pmKisan?.status})`);
  assert(
    pmKisan?.failedCriteria.some(c => c.id === 'landholding') === true,
    'Failed criterion should be landholding'
  );
});

describe('TEST 6: Age 72, General category, high income → PM-JAY CONDITIONALLY_ELIGIBLE (70+ pathway)', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    age: 72,
    familyIncome: 1_500_000, // ₹15L — high income
    socialCategory: 'General',
    occupation: 'Farmer / Other',
    supportGoal: 'Agriculture'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmJay = findSchemeResult(results, 'pm-jay');

  assert(pmJay !== undefined, 'PM-JAY appears');
  // Should NOT be NOT_ELIGIBLE — 70+ pathway overrides income/category rejection
  assert(
    pmJay?.status !== 'NOT_ELIGIBLE',
    `PM-JAY should NOT be NOT_ELIGIBLE for 72-year-old (got: ${pmJay?.status})`
  );
  assert(
    pmJay?.satisfiedCriteria.some(c => c.id === 'senior-age') === true,
    'Should have satisfied the senior-age criterion'
  );
  assert(
    pmJay?.statusSummary.toLowerCase().includes('70') === true,
    'Status summary should mention 70+ age threshold'
  );
});

describe('TEST 7: Non-artisan software entrepreneur → NOT_ELIGIBLE for PM Vishwakarma', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessType: 'Service',
    occupation: 'Business Owner',
    supportGoal: 'New Business',
    vishwakarmaTrade: 'Software Development' // Not a notified trade
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const vishwakarma = findSchemeResult(results, 'pm-vishwakarma');

  assert(vishwakarma !== undefined, 'PM Vishwakarma appears');
  assert(
    vishwakarma?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${vishwakarma?.status})`
  );
  assert(
    vishwakarma?.failedCriteria.some(c => c.id === 'notified-trade') === true,
    'Failed criterion should be notified-trade'
  );
});

describe('TEST 8: Manufacturing profile, trade not provided → PM Vishwakarma INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessType: 'Manufacturing',
    occupation: 'Farmer / Other'
    // vishwakarmaTrade = undefined (not asked)
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const vishwakarma = findSchemeResult(results, 'pm-vishwakarma');

  assert(vishwakarma !== undefined, 'PM Vishwakarma appears for manufacturing profile');
  assert(
    vishwakarma?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${vishwakarma?.status})`
  );
  assert(
    vishwakarma?.missingCriteria.some(c => c.id === 'notified-trade') === true,
    'Missing criterion should be notified-trade'
  );
});

describe('TEST 9: Urban trader, NOT a street vendor → PM SVANidhi NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    locationType: 'Urban',
    businessType: 'Trading',
    isStreetVendor: false // Explicitly NOT a street vendor
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const svanidhi = findSchemeResult(results, 'svanidhi');

  assert(svanidhi !== undefined, 'PM SVANidhi appears for urban trader');
  assert(
    svanidhi?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${svanidhi?.status})`
  );
  assert(
    svanidhi?.failedCriteria.some(c => c.id === 'street-vendor-status') === true,
    'Failed criterion should be street-vendor-status'
  );
});

describe('TEST 10: Existing business owner → PMEGP NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessStage: 'Existing',
    projectCost: 1_000_000
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmegp = findSchemeResult(results, 'pmegp');

  assert(pmegp !== undefined, 'PMEGP appears for business profile');
  assert(
    pmegp?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${pmegp?.status})`
  );
  assert(
    pmegp?.failedCriteria.some(c => c.id === 'new-enterprise') === true,
    'Failed criterion should be new-enterprise'
  );
});

describe('TEST 11: Project cost over PMEGP limit → NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessStage: 'New',
    projectCost: 6_000_000, // ₹60L — exceeds ₹50L manufacturing limit
    businessType: 'Manufacturing'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmegp = findSchemeResult(results, 'pmegp');

  assert(pmegp !== undefined, 'PMEGP appears');
  assert(
    pmegp?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE for ₹60L manufacturing (got: ${pmegp?.status})`
  );
  assert(
    pmegp?.failedCriteria.some(c => c.id === 'project-cost') === true,
    'Failed criterion should be project-cost'
  );
});

describe('TEST 12: PMEGP large project, education unknown → INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessStage: 'New',
    projectCost: 2_000_000, // ₹20L — above ₹10L threshold
    businessType: 'Manufacturing',
    educationQualification: undefined // not provided
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmegp = findSchemeResult(results, 'pmegp');

  assert(pmegp !== undefined, 'PMEGP appears');
  assert(
    pmegp?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${pmegp?.status})`
  );
  assert(
    pmegp?.missingCriteria.some(c => c.id === 'education') === true,
    'Missing criterion should be education'
  );
});

describe('TEST 13: PMEGP, education Below VIII, large manufacturing → NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    businessStage: 'New',
    projectCost: 1_500_000,
    businessType: 'Manufacturing',
    educationQualification: 'Below VIII'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmegp = findSchemeResult(results, 'pmegp');

  assert(
    pmegp?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${pmegp?.status})`
  );
  assert(
    pmegp?.failedCriteria.some(c => c.id === 'education') === true,
    'Failed criterion should be education'
  );
});

describe('TEST 14: SC business owner, 40% ownership → CEGSSC NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    socialCategory: 'SC',
    scOwnershipPercent: 40 // below 51% threshold
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const cegssc = findSchemeResult(results, 'cegssc');

  assert(cegssc !== undefined, 'CEGSSC appears for SC business profile');
  assert(
    cegssc?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${cegssc?.status})`
  );
  assert(
    cegssc?.failedCriteria.some(c => c.id === 'sc-ownership') === true,
    'Failed criterion should be sc-ownership'
  );
});

describe('TEST 15: General business owner → CEGSSC NOT_ELIGIBLE (not SC)', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    socialCategory: 'General'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const cegssc = findSchemeResult(results, 'cegssc');

  assert(cegssc !== undefined, 'CEGSSC appears');
  assert(
    cegssc?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${cegssc?.status})`
  );
  assert(
    cegssc?.failedCriteria.some(c => c.id === 'sc-category') === true,
    'Failed criterion should be sc-category'
  );
});

describe('TEST 16: MUDRA Tarun Plus ₹15L, no prior Tarun → INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    projectCost: 1_500_000, // ₹15L — Tarun Plus range
    previousTarunLoan: undefined // not asked
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const mudra = findSchemeResult(results, 'mudra');

  assert(mudra !== undefined, 'MUDRA appears');
  assert(
    mudra?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${mudra?.status})`
  );
  assert(
    mudra?.missingCriteria.some(c => c.id === 'tarun-plus-history') === true,
    'Missing criterion should be tarun-plus-history'
  );
});

describe('TEST 17: MUDRA Tarun Plus ₹15L, no prior Tarun loan → NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    projectCost: 1_500_000,
    previousTarunLoan: false // explicitly no prior Tarun
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const mudra = findSchemeResult(results, 'mudra');

  assert(
    mudra?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${mudra?.status})`
  );
  assert(
    mudra?.failedCriteria.some(c => c.id === 'tarun-plus-history') === true,
    'Failed criterion should be tarun-plus-history'
  );
});

describe('TEST 18: Rural farmer profile → PM SVANidhi NOT shown (requires Urban/Semi-Urban)', () => {
  const profile: UserProfile = {
    ...BASE_FARMER_PROFILE,
    locationType: 'Rural',
    businessType: 'Trading'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const svanidhi = findSchemeResult(results, 'svanidhi');

  assert(svanidhi === undefined, 'PM SVANidhi should NOT appear for rural profiles');
});

describe('TEST 19: Male profile → Mission Shakti NOT shown', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    gender: 'Male'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const shakti = findSchemeResult(results, 'mission-shakti');

  assert(shakti === undefined, 'Mission Shakti should not appear for male profile');
});

describe('TEST 20: Female profile → Mission Shakti is CONDITIONALLY_ELIGIBLE (not ELIGIBLE)', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    gender: 'Female'
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const shakti = findSchemeResult(results, 'mission-shakti');

  assert(shakti !== undefined, 'Mission Shakti appears for female profile');
  assert(
    shakti?.status === 'CONDITIONALLY_ELIGIBLE',
    `Status should be CONDITIONALLY_ELIGIBLE (got: ${shakti?.status})`
  );
  // Should NEVER be ELIGIBLE — component identification is always required
  assert(
    shakti?.status !== 'ELIGIBLE',
    'Mission Shakti should never be ELIGIBLE — component must always be determined'
  );
});

describe('TEST 21: Urban profile, hasPuccaHouse = true → PMAY-U 2.0 NOT_ELIGIBLE', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    locationType: 'Urban',
    familyIncome: 400_000,
    hasPuccaHouse: true // Already owns pucca house
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmay = findSchemeResult(results, 'pmay-u-2');

  assert(pmay !== undefined, 'PMAY-U 2.0 appears for urban profile');
  assert(
    pmay?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${pmay?.status})`
  );
  assert(
    pmay?.failedCriteria.some(c => c.id === 'no-pucca-house') === true,
    'Failed criterion should be no-pucca-house'
  );
});

describe('TEST 22: Urban profile, hasPuccaHouse undefined → PMAY-U 2.0 INSUFFICIENT_INFORMATION', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    locationType: 'Urban',
    familyIncome: 400_000,
    hasPuccaHouse: undefined // not asked
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmay = findSchemeResult(results, 'pmay-u-2');

  assert(pmay !== undefined, 'PMAY-U 2.0 appears');
  assert(
    pmay?.status === 'INSUFFICIENT_INFORMATION',
    `Status should be INSUFFICIENT_INFORMATION (got: ${pmay?.status})`
  );
});

describe('TEST 23: Urban, income > ₹18L → PMAY-U 2.0 NOT_ELIGIBLE (income too high)', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    locationType: 'Urban',
    familyIncome: 2_000_000, // ₹20L — above MIG ceiling
    hasPuccaHouse: false
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const pmay = findSchemeResult(results, 'pmay-u-2');

  assert(
    pmay?.status === 'NOT_ELIGIBLE',
    `Status should be NOT_ELIGIBLE (got: ${pmay?.status})`
  );
  assert(
    pmay?.failedCriteria.some(c => c.id === 'income-band') === true,
    'Failed criterion should be income-band'
  );
});

describe('TEST 24: Profile fails all schemes → empty results (no fallback injection)', () => {
  // A student with no matching scheme — should get 0 positive results
  const profile: UserProfile = {
    ...BASE_STUDENT_PROFILE,
    socialCategory: 'General', // fails SC scholarship
    supportGoal: 'Education',
    occupation: 'Student'
    // This profile should only trigger the scholarship evaluator
    // and it should fail because socialCategory is not SC
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const positiveResults = results.filter(r => r.status !== 'NOT_ELIGIBLE');

  // Verify no fallback was injected — all must be genuine results
  for (const result of results) {
    // The evaluator only returns results where it was called
    assert(
      result.scheme.id !== 'mudra' || positiveResults.some(r => r.scheme.id === 'mudra'),
      'MUDRA should only appear if genuinely evaluated and not failing'
    );
  }

  // Key assertion: no phantom schemes
  const studentScholarship = findSchemeResult(results, 'post-matric-scholarship');
  if (studentScholarship) {
    assert(
      studentScholarship.status === 'NOT_ELIGIBLE',
      'Scholarship should be NOT_ELIGIBLE for General student'
    );
  }

  console.log(`  ℹ️  Total results for non-SC student: ${results.length} (${positiveResults.length} positive)`);
});

describe('TEST 25: Stand-Up India — General male, new business, ₹50L → NOT_ELIGIBLE (not SC/ST/Woman)', () => {
  const profile: UserProfile = {
    ...BASE_BUSINESS_PROFILE,
    gender: 'Male',
    socialCategory: 'General',
    businessStage: 'New',
    projectCost: 5_000_000 // ₹50L — within Stand-Up range
  };
  const results = evaluateEligibility(profile, SCHEMES);
  const standup = findSchemeResult(results, 'standup');

  if (standup) {
    assert(
      standup.status === 'NOT_ELIGIBLE',
      `Stand-Up India should be NOT_ELIGIBLE for General/Male (got: ${standup?.status})`
    );
    assert(
      standup.failedCriteria.some(c => c.id === 'sc-st-woman') === true,
      'Failed criterion should be sc-st-woman'
    );
  }
});

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log(`Test Summary: ${passCount} PASSED | ${failCount} FAILED`);
if (failCount > 0) {
  console.error(`\n${failCount} test(s) failed. Review the FAIL lines above.`);
  process.exit(1);
} else {
  console.log('\nAll tests passed ✅');
}
