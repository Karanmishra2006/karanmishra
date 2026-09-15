import { Scheme } from '../types';

export const SCHEMES_DATABASE: Scheme[] = [
  {
    id: 'pmegp',
    title: 'Prime Minister Employment Generation Programme (PMEGP)',
    shortName: 'PMEGP',
    ministry: 'Ministry of Micro, Small & Medium Enterprises (MoMSME)',
    category: 'MSME',
    sectorType: 'Central Sector',
    benefitHeadline: 'Up to 35% Capital Subsidy',
    maxCeilingText: 'Max Project Cost: ₹50 Lakhs (Mfg) / ₹20 Lakhs (Service)',
    description:
      'Credit-linked subsidy programme to generate continuous self-employment opportunities in rural and urban areas through setting up of new micro-enterprises in manufacturing and services.',
    statutoryClause: 'PMEGP Operational Guidelines Clause 4.2',
    officialPortalUrl: 'https://www.kviconline.gov.in/pmegpeportal/',
    objectives:
      'To generate continuous and sustainable employment opportunities in rural and urban areas through micro-enterprises, facilitating bank credit and margin money subsidy.',
    eligibilityParameters: [
      'Any individual above 18 years of age is eligible.',
      'Minimum VIII standard pass for projects costing above ₹10 lakh in manufacturing and above ₹5 lakh in service sector.',
      'Only newly established micro-enterprises are eligible for subsidy assistance under first loan tranche.',
      'General category subsidy: 15% (Urban) / 25% (Rural). Special category (Women, SC/ST, OBC, Minorities, PwD, Ex-Servicemen): 25% (Urban) / 35% (Rural).',
      'Own contribution required is 10% for General and 5% for Special Category beneficiaries.'
    ],
    requiredDocuments: [
      'Aadhaar Card and PAN Card',
      'Detailed Project Report (DPR) / Business Blueprint',
      'Special Category Caste Certificate (if claiming affirmative subsidy rate)',
      'Educational qualification certificate (VIII pass minimum for >₹10L Mfg)',
      'Rural area certificate issued by Gram Panchayat / Revenue authority (if rural)',
      'EDP (Entrepreneurship Development Programme) completion certificate'
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 5000000
  },
  {
    id: 'standup',
    title: 'Stand-Up India Scheme for Women and SC/ST Entrepreneurs',
    shortName: 'Stand-Up India',
    ministry: 'Department of Financial Services, Ministry of Finance',
    category: 'MSME',
    sectorType: 'Priority Banking',
    benefitHeadline: '₹10 Lakh to ₹1 Crore',
    maxCeilingText: 'Composite Loan Facility (Term Loan + Working Capital)',
    description:
      'Facilitates bank loans between ₹10 lakh and ₹1 crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
    statutoryClause: 'Stand-Up India Scheme Guidelines Rule 1.1',
    officialPortalUrl: 'https://www.standupmitra.in/',
    objectives:
      'To promote entrepreneurship among women and SC & ST communities by facilitating institutional credit for starting new business ventures in manufacturing, services, agri-allied, or trading sectors.',
    eligibilityParameters: [
      'Applicant must be either an SC, ST, or Woman entrepreneur.',
      'Enterprise must be a Greenfield project (the first time venture of the beneficiary in the manufacturing, services, agri-allied activities, or trading sector).',
      'In case of non-individual enterprises, at least 51% of shareholding and controlling stake must be held by either an SC/ST or woman entrepreneur.',
      'Borrower should not be in default to any bank or financial institution.',
      'Margin money contribution is minimum 10% to 15% with convergence of other schemes.'
    ],
    requiredDocuments: [
      'Identity & Address Proof (Voter ID / Passport / Aadhaar)',
      'Caste Certificate (for SC/ST applicants) issued by competent authority',
      'Greenfield Enterprise Registration / Proposed Project DPR',
      'Partnership deed or Memorandum & Articles of Association (for firms/companies)',
      'Audited balance sheets or IT returns of promoters (if existing entities participate)',
      'Rent agreement or proof of business premises'
    ],
    minAge: 18,
    maxAge: 70,
    maxProjectCost: 10000000
  },
  {
    id: 'mudra',
    title: 'Pradhan Mantri MUDRA Yojana (PMMY — Kishore & Tarun)',
    shortName: 'PM MUDRA',
    ministry: 'Department of Financial Services, Ministry of Finance',
    category: 'MSME',
    sectorType: 'Central Sector',
    benefitHeadline: 'Up to ₹10 Lakhs',
    maxCeilingText: 'Zero Collateral Security Required',
    description:
      'Provides institutional funding to non-corporate, non-farm small and micro enterprises. Categorized into Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (₹5 Lakh to ₹10 Lakh).',
    statutoryClause: 'PMMY Operational Framework Section 3',
    officialPortalUrl: 'https://www.mudra.org.in/',
    objectives:
      'To formalize and fund the unfunded small businesses, enabling easy collateral-free micro credit access through Commercial Banks, RRBs, Small Finance Banks, and NBFCs.',
    eligibilityParameters: [
      'Any Indian citizen who has a business plan for non-farm income generating activity (small manufacturing units, shopkeepers, fruits/vegetable vendors, artisans, food service, repair shops).',
      'No collateral security or third-party guarantee required for loans up to ₹10 Lakh.',
      'Clean credit history with no prior defaults on any institutional credit facility.',
      'Udyam Registration required for enterprise sanction.',
      'Repayment tenure between 3 to 5 years depending on cash flow projections.'
    ],
    requiredDocuments: [
      'Proof of Identity & Address (Aadhaar / Driving License / Voter Card)',
      'Udyam Registration Number Certificate',
      'Quotation of machinery, equipment, or merchandise to be purchased',
      'Bank statement for past 6 months (for existing business expansion)',
      'Proof of business address and license certificates'
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 1000000
  },
  {
    id: 'aif',
    title: 'Agriculture Infrastructure Fund (AIF)',
    shortName: 'AIF',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    category: 'Agriculture',
    sectorType: 'Central Sector',
    benefitHeadline: '3% Interest Subvention',
    maxCeilingText: 'Loan up to ₹2 Crore per project (Max 7 years subvention)',
    description:
      'Medium to long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.',
    statutoryClause: 'AIF Operational Guidelines Clause 5.1',
    officialPortalUrl: 'https://agriinfra.dac.gov.in/',
    objectives:
      'Mobilize medium-to-long term debt financing facility for investment in post-harvest management infrastructure, cold chains, silos, warehouses, and primary processing centers.',
    eligibilityParameters: [
      'Eligible entities: Primary Agricultural Credit Societies (PACS), Marketing Cooperative Societies, Farmer Producers Organizations (FPOs), SHGs, Agri-entrepreneurs, Startups.',
      'All loans under this financing facility have interest subvention of 3% per annum up to a limit of ₹2 Crore.',
      'Credit guarantee coverage available under CGTMSE scheme for loans up to ₹2 Crore, with fee paid by the government.',
      'Moratorium for repayment may vary between minimum 6 months and maximum 2 years.'
    ],
    requiredDocuments: [
      'Entity Registration / FPO / Society registration papers',
      'Detailed Project Report (DPR) detailing post-harvest asset creation',
      'Land ownership documents or registered lease deed (minimum 10 years)',
      'Bank account statement and KYC of managing members / promoter'
    ],
    minAge: 18,
    maxAge: 70,
    maxProjectCost: 20000000
  },
  {
    id: 'shakti',
    title: 'Mission Shakti (Samarthya — Women Entrepreneurship & Empowerment)',
    shortName: 'Mission Shakti',
    ministry: 'Ministry of Women & Child Development',
    category: 'Social',
    sectorType: 'Centrally Sponsored',
    benefitHeadline: 'Women Affirmative Support',
    maxCeilingText: 'Micro-Credit, Skill Incubation & Institutional Grants',
    description:
      'Integrated women empowerment program promoting economic self-reliance through skill training, creche facilities, collective micro-enterprise development, and institutional credit linkages.',
    statutoryClause: 'Mission Shakti Samarthya Guidelines 2022-26',
    officialPortalUrl: 'https://wcd.nic.in/',
    objectives:
      'To provide women with sustained economic autonomy, market linkages for self-help groups, and institutional support systems for safety, security, and enterprise creation.',
    eligibilityParameters: [
      'Individual women entrepreneurs or Women Self Help Groups (SHGs).',
      'Preference given to rural, economically weaker sections, single mothers, and women in distress.',
      'Focus on women-led micro enterprises, handicraft collectives, food processing units, and village level services.',
      'Convergence with NRLM (National Rural Livelihoods Mission) revolving fund credit guidelines.'
    ],
    requiredDocuments: [
      'Aadhaar of applicant or SHG key office bearers',
      'Bank passbook linked to Aadhaar (DBT active)',
      'SHG resolution or self-declaration for micro-enterprise proposal',
      'Proof of residence / Gram Panchayat letter'
    ],
    minAge: 18,
    maxAge: 60
  },
  {
    id: 'cegssc',
    title: 'Credit Enhancement Guarantee Scheme for SC Entrepreneurs',
    shortName: 'CEGSSC',
    ministry: 'Ministry of Social Justice & Empowerment',
    category: 'Social',
    sectorType: 'Credit Guarantee',
    benefitHeadline: '100% Guarantee Cover',
    maxCeilingText: 'Term Loans / Composite Loans up to ₹5 Crore',
    description:
      'Enables Member Lending Institutions (MLIs) to provide collateral-free financial assistance to Scheduled Caste entrepreneurs for commercially viable projects.',
    statutoryClause: 'CEGSSC Operational Framework 2021',
    officialPortalUrl: 'https://socialjustice.gov.in/',
    objectives:
      'To promote entrepreneurship among the Scheduled Castes by providing credit guarantee covers to banks, eliminating stringent tangible asset collateral barriers.',
    eligibilityParameters: [
      'SC individual entrepreneurs or SC-owned enterprises with more than 51% shareholding by SC promoters for at least 6 months prior to application.',
      'Management control must be held by SC promoters.',
      'Guarantee cover ranges from 100% for loans up to ₹1 Crore and graded covers up to ₹5 Crore.',
      'Valid for Greenfield and Brownfield enterprise expansions in manufacturing, trading, and service sectors.'
    ],
    requiredDocuments: [
      'Caste Certificate of applicant / promoters issued by competent state revenue authority',
      'Company / Firm Registration documents confirming SC shareholding > 51%',
      'Detailed Project Report (DPR) evaluated by lending financial institution',
      'KYC documents and IT returns / Bank statements'
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 50000000
  },
  {
    id: 'svanidhi',
    title: 'PM SVANidhi (Street Vendor’s AtmaNirbhar Nidhi)',
    shortName: 'PM SVANidhi',
    ministry: 'Ministry of Housing & Urban Affairs (MoHUA)',
    category: 'MSME',
    sectorType: 'Central Sector',
    benefitHeadline: '₹10k to ₹50k Working Capital',
    maxCeilingText: '7% Interest Subsidy + Cash-back on Digital Transactions',
    description:
      'Special micro-credit facility for street vendors and micro retailers to restart their livelihoods. Provides working capital loan in escalating tranches upon timely repayment with interest subsidy.',
    statutoryClause: 'PM SVANidhi Scheme Notification 2020',
    officialPortalUrl: 'https://pmsvanidhi.mohua.gov.in/',
    objectives:
      'To provide working capital loans, incentivize regular repayment with interest subvention, and reward digital transactions among street vendors and micro retailers.',
    eligibilityParameters: [
      'Urban and peri-urban street vendors possessing Certificate of Vending or Identity Card issued by Urban Local Bodies (ULBs).',
      'Initial loan up to ₹10,000 for 1 year tenure; on timely repayment, second loan up to ₹20,000, and third loan up to ₹50,000.',
      'Interest subsidy of 7% per annum credited directly to bank account via DBT.',
      'Cashback of up to ₹1,200 per year on eligible digital transactions.'
    ],
    requiredDocuments: [
      'Aadhaar Card and Mobile-linked bank account',
      'Certificate of Vending / Letter of Recommendation (LoR) from ULB / Town Vending Committee'
    ],
    minAge: 18,
    maxAge: 70,
    maxProjectCost: 50000
  },
  {
    id: 'pm-vishwakarma',
    title: 'PM Vishwakarma Scheme',
    shortName: 'PM Vishwakarma',
    ministry: 'Ministry of Micro, Small & Medium Enterprises (MoMSME)',
    category: 'MSME',
    sectorType: 'Central Sector',
    benefitHeadline: '₹3 Lakh Loan @ Concessional 5%',
    maxCeilingText: 'Skill Training + ₹15,000 Modern Tool-kit Incentive',
    description:
      'Comprehensive institutional support for traditional artisans and craftspeople engaged in 18 notified family trades, including carpenters, blacksmiths, goldsmiths, potters, sculptors, and weavers.',
    statutoryClause: 'PM Vishwakarma Scheme Guidelines 2023',
    officialPortalUrl: 'https://pmvishwakarma.gov.in/',
    objectives:
      'To enable traditional craftspeople and artisans to scale their enterprises, upgrade their toolkits, access formal credit, and integrate into domestic and global value chains.',
    eligibilityParameters: [
      'An artisan or craftsperson working with hands and tools in one of the 18 traditional family-based trades.',
      'Minimum age of 18 years on the date of registration.',
      'Registration is restricted to one member of the family.',
      'Beneficiary should not have availed credit facilities under similar government self-employment schemes in the past 5 years.',
      'Collateral-free credit: Tranche 1 of up to ₹1 Lakh (18 months tenure) and Tranche 2 of up to ₹2 Lakh (30 months tenure) at fixed 5% interest.'
    ],
    requiredDocuments: [
      'Aadhaar Card, Mobile Number, Bank Account Details',
      'Ration Card / Family Proof (for single family member verification)',
      'Artisan trade declaration verified by Gram Panchayat or ULB'
    ],
    minAge: 18,
    maxAge: 65,
    maxProjectCost: 300000
  },
  {
    id: 'post-matric-scholarship',
    title: 'Post-Matric Scholarship for Higher Education',
    shortName: 'Post-Matric Scholarship',
    ministry: 'Ministry of Social Justice & Empowerment / Ministry of Education',
    category: 'Education',
    sectorType: 'Centrally Sponsored',
    benefitHeadline: '100% Tuition & Maintenance Fees',
    maxCeilingText: 'Direct Benefit Transfer (DBT) to Student Account',
    description:
      'Comprehensive financial support to students from Scheduled Castes, Scheduled Tribes, OBC, and economically disadvantaged groups to pursue post-matriculation and higher educational courses.',
    statutoryClause: 'Centrally Sponsored Post Matric Scholarship Guidelines',
    officialPortalUrl: 'https://scholarships.gov.in/',
    objectives:
      'To appreciably increase the Gross Enrolment Ratio (GER) of students in higher education by providing full fee reimbursement and maintenance allowances.',
    eligibilityParameters: [
      'Must be enrolled in recognized post-secondary institutions, degree, diploma, or professional college courses.',
      'Annual family income must not exceed ₹2,50,000 per annum from all gazetted sources.',
      'Applicable across general and professional degrees including Engineering, Medicine, Management, and Arts/Science degrees.',
      'Direct disbursement through National Scholarship Portal (NSP) Aadhaar payment bridge.'
    ],
    requiredDocuments: [
      'Aadhaar Card and Student Bank Passbook (DBT activated)',
      'Caste Certificate / Special Category verification',
      'Income Certificate issued by authorized Tehsildar / Sub-Divisional Magistrate',
      'College Admission Fee receipt and 10th/12th Marks memo'
    ],
    minAge: 16,
    maxAge: 35,
    maxIncome: 250000
  }
];
