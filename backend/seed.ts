import mongoose from "mongoose";
import dotenv from "dotenv";
import Scheme from "./models/scheme";

dotenv.config({ path: "../.env" });

const schemes = [
  {
    id: "pmegp",
    title: "Prime Minister Employment Generation Programme (PMEGP)",
    shortName: "PMEGP",
    ministry: "Ministry of Micro, Small & Medium Enterprises",
    category: "MSME",
    sectorType: "Central Sector",
    benefitHeadline: "Up to 35% Capital Subsidy",
    maxCeilingText: "Max Project Cost: ₹50 Lakhs (Manufacturing) / ₹20 Lakhs (Service)",
    description:
      "Credit-linked subsidy programme supporting new micro-enterprises in manufacturing and service activities.",
    statutoryClause: "PMEGP Scheme Guidelines",
    officialPortalUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    objectives:
      "To generate sustainable employment through new micro-enterprises in rural and urban areas.",
    eligibilityParameters: [
      "Applicant must be at least 18 years old.",
      "Only new eligible micro-enterprises qualify for subsidy.",
      "VIII standard pass is required for projects above specified cost thresholds.",
      "Special categories receive higher subsidy rates."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "PAN Card",
      "Detailed Project Report",
      "Educational qualification certificate where applicable",
      "Category certificate where applicable"
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 5000000
  },

  {
    id: "mudra",
    title: "Pradhan Mantri MUDRA Yojana (PMMY)",
    shortName: "PM MUDRA",
    ministry: "Department of Financial Services, Ministry of Finance",
    category: "MSME",
    sectorType: "Central Sector",
    benefitHeadline: "Loans up to ₹20 Lakhs",
    maxCeilingText: "Shishu, Kishore, Tarun & Tarun Plus",
    description:
      "Provides institutional credit to micro and small businesses and income-generating activities.",
    statutoryClause: "Pradhan Mantri MUDRA Yojana Guidelines",
    officialPortalUrl: "https://www.mudra.org.in/",
    objectives:
      "To provide accessible institutional credit to micro enterprises and small businesses.",
    eligibilityParameters: [
      "Indian citizens with eligible non-farm income-generating activities can apply.",
      "Shishu loans are available up to ₹50,000.",
      "Kishore covers ₹50,000 to ₹5 Lakhs.",
      "Tarun covers ₹5 Lakhs to ₹10 Lakhs.",
      "Tarun Plus can provide ₹10 Lakhs to ₹20 Lakhs to eligible borrowers who have successfully repaid a previous Tarun loan."
    ],
    requiredDocuments: [
      "Identity and address proof",
      "Business proof",
      "Business plan or project details",
      "Bank documents",
      "Udyam registration where applicable"
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 2000000
  },

  {
    id: "pm-vishwakarma",
    title: "PM Vishwakarma Scheme",
    shortName: "PM Vishwakarma",
    ministry: "Ministry of Micro, Small & Medium Enterprises",
    category: "MSME",
    sectorType: "Central Sector",
    benefitHeadline: "Up to ₹3 Lakh Credit at 5%",
    maxCeilingText: "Skill Training + ₹15,000 Toolkit Incentive",
    description:
      "Supports traditional artisans and craftspeople working in notified traditional trades.",
    statutoryClause: "PM Vishwakarma Scheme Guidelines",
    officialPortalUrl: "https://pmvishwakarma.gov.in/",
    objectives:
      "To provide recognition, skills, tools, credit and market support to traditional artisans.",
    eligibilityParameters: [
      "Applicant must be at least 18 years old.",
      "Applicant must work in one of the notified traditional trades.",
      "Only one member of a family can register.",
      "Credit support is provided in two tranches subject to scheme conditions."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Mobile number",
      "Bank account details",
      "Family details",
      "Artisan/trade verification"
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 300000
  },

  {
    id: "svanidhi",
    title: "PM SVANidhi",
    shortName: "PM SVANidhi",
    ministry: "Ministry of Housing & Urban Affairs",
    category: "MSME",
    sectorType: "Central Sector",
    benefitHeadline: "Working Capital Support up to ₹50,000",
    maxCeilingText: "Escalating Loan Tranches + Interest Subsidy",
    description:
      "Provides working capital support to eligible street vendors.",
    statutoryClause: "PM SVANidhi Scheme Guidelines",
    officialPortalUrl: "https://pmsvanidhi.mohua.gov.in/",
    objectives:
      "To provide working capital and encourage regular repayment and digital transactions among street vendors.",
    eligibilityParameters: [
      "Designed for eligible street vendors.",
      "Initial and subsequent loan tranches are subject to scheme conditions.",
      "Eligible borrowers can receive interest subsidy for timely repayment."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Bank account details",
      "Certificate of Vending or Letter of Recommendation where applicable"
    ],
    minAge: 18,
    maxAge: 70,
    maxProjectCost: 50000
  },

  {
    id: "pm-kisan",
    title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    shortName: "PM-KISAN",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    sectorType: "Central Sector",
    benefitHeadline: "₹6,000 per Year",
    maxCeilingText: "Three Equal Installments of ₹2,000",
    description:
      "Income support scheme providing financial assistance to eligible landholding farmer families.",
    statutoryClause: "PM-KISAN Scheme Guidelines",
    officialPortalUrl: "https://pmkisan.gov.in/",
    objectives:
      "To provide income support to eligible farmer families to help meet agricultural and domestic needs.",
    eligibilityParameters: [
      "Eligible landholding farmer families can receive income support subject to scheme conditions.",
      "Land and beneficiary records must satisfy applicable verification requirements.",
      "Certain categories of higher-income and institutional beneficiaries are excluded."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Bank account details",
      "Land records",
      "Mobile number"
    ],
    minAge: 18,
    maxAge: 70
  },

  {
    id: "aif",
    title: "Agriculture Infrastructure Fund (AIF)",
    shortName: "AIF",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "Agriculture",
    sectorType: "Central Sector",
    benefitHeadline: "3% Interest Subvention",
    maxCeilingText: "Eligible Loans up to ₹2 Crore",
    description:
      "Debt financing support for post-harvest management infrastructure and community farming assets.",
    statutoryClause: "Agriculture Infrastructure Fund Guidelines",
    officialPortalUrl: "https://agriinfra.dac.gov.in/",
    objectives:
      "To finance viable agricultural infrastructure such as warehouses, cold chains and primary processing facilities.",
    eligibilityParameters: [
      "Eligible farmers, agri-entrepreneurs, FPOs, cooperatives and other notified entities may apply.",
      "Interest subvention is available subject to scheme conditions.",
      "Projects must fall within eligible infrastructure categories."
    ],
    requiredDocuments: [
      "KYC documents",
      "Entity registration where applicable",
      "Detailed Project Report",
      "Land ownership or valid lease documents where applicable",
      "Bank documents"
    ],
    minAge: 18,
    maxAge: 70,
    maxProjectCost: 20000000
  },

  {
    id: "cegssc",
    title: "Credit Enhancement Guarantee Scheme for Scheduled Castes",
    shortName: "CEGSSC",
    ministry: "Ministry of Social Justice & Empowerment",
    category: "Social",
    sectorType: "Credit Guarantee",
    benefitHeadline: "Credit Guarantee Support",
    maxCeilingText: "Guarantee Support Subject to Scheme Limits",
    description:
      "Provides credit guarantee support to eligible Scheduled Caste entrepreneurs and enterprises.",
    statutoryClause: "CEGSSC Scheme Guidelines",
    officialPortalUrl: "https://socialjustice.gov.in/",
    objectives:
      "To improve access to institutional credit for eligible SC entrepreneurs by reducing collateral-related barriers.",
    eligibilityParameters: [
      "Applicant or enterprise must satisfy applicable Scheduled Caste ownership requirements.",
      "Enterprise and loan must meet the scheme's eligibility conditions.",
      "Guarantee coverage is subject to applicable limits and lending institution requirements."
    ],
    requiredDocuments: [
      "SC Caste Certificate",
      "KYC documents",
      "Enterprise registration documents",
      "Detailed Project Report",
      "Bank and financial documents"
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 50000000
  },

  {
    id: "post-matric-scholarship",
    title: "Post-Matric Scholarship for Scheduled Castes",
    shortName: "Post-Matric Scholarship",
    ministry: "Ministry of Social Justice & Empowerment",
    category: "Education",
    sectorType: "Centrally Sponsored",
    benefitHeadline: "Financial Support for Post-Matric Education",
    maxCeilingText: "Scholarship Support Subject to Course and Eligibility",
    description:
      "Financial assistance for eligible Scheduled Caste students pursuing recognized post-matriculation education.",
    statutoryClause: "Post-Matric Scholarship for SCs Guidelines",
    officialPortalUrl: "https://scholarships.gov.in/",
    objectives:
      "To support SC students in pursuing post-matric and higher education.",
    eligibilityParameters: [
      "Applicant must satisfy Scheduled Caste eligibility requirements.",
      "Student must be pursuing an eligible recognized course.",
      "Family income must satisfy the applicable scheme limit."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Caste Certificate",
      "Income Certificate",
      "Student Bank Account",
      "Admission/Fee documents"
    ],
    minAge: 16,
    maxAge: 35,
    maxIncome: 250000
  },

  {
    id: "mission-shakti",
    title: "Mission Shakti",
    shortName: "Mission Shakti",
    ministry: "Ministry of Women & Child Development",
    category: "Social",
    sectorType: "Centrally Sponsored",
    benefitHeadline: "Women Empowerment & Support",
    maxCeilingText: "Support Depends on the Applicable Component",
    description:
      "An umbrella programme focused on women's safety, security and empowerment through its different components.",
    statutoryClause: "Mission Shakti Guidelines",
    officialPortalUrl: "https://spniwcd.wcd.gov.in/",
    objectives:
      "To strengthen support systems and empowerment opportunities for women.",
    eligibilityParameters: [
      "Eligibility depends on the specific Mission Shakti component.",
      "Women may access applicable services and support subject to component-specific conditions."
    ],
    requiredDocuments: [
      "Aadhaar or other identity proof where required",
      "Residence proof where required",
      "Documents specified by the applicable component"
    ],
    minAge: 18,
    maxAge: 60
  },

  {
    id: "pmay-u-2",
    title: "PMAY-U 2.0",
    shortName: "PMAY-U 2.0",
    ministry: "Ministry of Housing & Urban Affairs",
    category: "Social",
    sectorType: "Centrally Sponsored",
    benefitHeadline: "Housing Assistance",
    maxCeilingText: "Housing Assistance Subject to Component and Eligibility",
    description:
      "Provides housing assistance to eligible urban families under different components of PMAY-U 2.0.",
    statutoryClause: "PMAY-U 2.0 Guidelines",
    officialPortalUrl: "https://pmay-urban.gov.in/",
    objectives:
      "To support eligible urban households in obtaining or improving adequate housing.",
    eligibilityParameters: [
      "Applicant must satisfy applicable urban housing eligibility conditions.",
      "Household income and existing housing status are considered.",
      "Applicant must satisfy the conditions of the selected PMAY-U 2.0 vertical."
    ],
    requiredDocuments: [
      "Aadhaar Card",
      "Income documents",
      "Residence/address proof",
      "Bank account details",
      "Property/land documents where applicable"
    ],
    minAge: 18,
    maxAge: 70
  },

  {
    id: "pm-jay",
    title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    shortName: "Ayushman Bharat PM-JAY",
    ministry: "Ministry of Health & Family Welfare",
    category: "Social",
    sectorType: "Central Sector",
    benefitHeadline: "Health Cover up to ₹5 Lakh per Family per Year",
    maxCeilingText: "Cashless Hospitalization at Empanelled Hospitals",
    description:
      "Government-funded health assurance providing eligible beneficiaries access to cashless secondary and tertiary hospitalization.",
    statutoryClause: "AB-PMJAY Scheme Guidelines",
    officialPortalUrl: "https://pmjay.gov.in/",
    objectives:
      "To reduce financial burden from hospitalization for eligible vulnerable families.",
    eligibilityParameters: [
      "Eligibility is determined according to the applicable beneficiary database and government criteria.",
      "Treatment is provided through empanelled hospitals.",
      "Coverage and benefits are subject to the applicable PM-JAY rules."
    ],
    requiredDocuments: [
      "Government-approved identity document",
      "Beneficiary identification details",
      "Documents required by the empanelled hospital"
    ],
    minAge: 0,
    maxAge: 100
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB connected successfully");

    await Scheme.deleteMany({});

    await Scheme.insertMany(schemes);

    console.log(`Successfully inserted ${schemes.length} schemes`);

    await mongoose.disconnect();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Seeding failed ❌", error);
    process.exit(1);
  }
}

seedDatabase();