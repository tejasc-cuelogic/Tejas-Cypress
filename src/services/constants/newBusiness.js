export const BUSINESS_GOAL = {
  UPGRADE: 'UPGRADE',
  RESTRUCTURE: 'RESTRUCTURE',
  BRAND_NEW: 'BRAND_NEW',
  FRANCHISE: 'FRANCHISE',
};

export const BUSINESS_PRE_QUALIFICATION = {
  businessModel: {
    value: 'B2C',
    values: [
      { label: 'Business to Consumer', value: 'B2C' },
      { label: 'Business to Business', value: 'B2B' },
    ],
    error: undefined,
    rule: 'required',
  },
  businessName: {
    value: '', label: 'Business Name', error: undefined, rule: 'required|string', placeHolder: 'e.g. NextBrewery',
  },
  webSite: {
    value: '', label: 'Website', error: undefined, rule: 'required|url', placeHolder: 'e.g. NextBrewery',
  },
  phoneNumber: {
    value: '', label: 'Phone Number', error: undefined, rule: 'required', placeHolder: '(123) 456 789',
  },
  email: {
    value: '', label: 'Email Address', error: undefined, rule: 'required|email', placeHolder: 'e.g.next.brewery@contact.com',
  },
  street: {
    value: '', label: 'Street', error: undefined, rule: 'required', placeHolder: 'e.g. NextBrewery',
  },
  city: {
    value: '', label: 'City', error: undefined, rule: 'required', placeHolder: 'e.g. NY',
  },
  state: {
    value: '', label: 'State', error: undefined, rule: 'required', placeHolder: 'e.g. NY',
  },
  zipCode: {
    value: '', label: 'Zip Code', error: undefined, rule: 'required', maxLength: 6,
  },
  industryExperience: {
    value: '',
    label: 'How many years of related industry experience does your team have?',
    error: undefined,
    rule: 'required|numeric',
    maxLength: 2,
    placeHolder: 'e.g. 5',
  },
  businessAgeYears: {
    value: '', maxLength: 4, label: 'Years', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: '1',
  },
  businessAgeMonths: {
    value: '', maxLength: 2, label: 'Months', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: '3',
  },
  franchiseHolder: {
    value: true,
    values: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    error: undefined,
    rule: 'required_if:businessGoal,FRANCHISE',
  },
  estimatedCreditScore: {
    value: '', maxLength: 8, label: 'What is your estimated credit score?', error: undefined, rule: 'required|numeric', placeHolder: 'e.g. 700',
  },
  totalProjectCost: {
    value: '', maxLength: 16, label: 'What’s the total project cost?', error: undefined, rule: 'required', placeHolder: 'e.g. 100,000',
  },
  amountNeeded: {
    value: '',
    maxLength: 16,
    label: 'How much do you need to raise on NextSeed?',
    error: undefined,
    rule: 'required',
    placeHolder: 'e.g. 50,000',
    tooltip: 'Minimum amount of funding is $50,000. For requirements on different levels of funding, click here.',
  },
  previousYearGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. 750,000',
  },
  previousYearCogSold: {
    value: '', label: 'Cost of Goods Sold', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. 75,000',
  },
  previousYearOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. 150,000',
  },
  previousYearNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. 525,000',
  },
  nextYearGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: 'e.g. 750,000',
  },
  nextYearCogSold: {
    value: '', label: 'Cost of Goods Sold', error: undefined, rule: 'required', placeHolder: 'e.g. 75,000',
  },
  nextYearOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: 'e.g. 150,000',
  },
  nextYearNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: 'e.g. 525,000',
  },
  industryTypes: {
    value: [],
    values: [
      { label: 'Fashion & Merchandising', icon: 'ns-store', value: 'FASHION_AND_APPAREL' },
      { label: 'Beauty & Spa', icon: 'ns-beauty-spa', value: 'BEAUTY_SALON' },
      { label: 'Food & Beverage', icon: 'ns-food-light', value: 'FOOD_AND_BEVERAGE' },
      { label: 'Real Estate', icon: 'ns-real-estate', value: 'REAL_ESTATE' },
      { label: 'Fitness & Wellness', icon: 'ns-dumbbells', value: 'FITNESS_AND_WELLNESS' },
      { label: 'Hospitality', icon: 'ns-first-aid', value: 'HOSPITALITY' },
      { label: 'Technology', icon: 'ns-technology', value: 'TECHNOLOGY' },
      { label: 'Other Industry Type', value: 'OTHER' },
    ],
    error: undefined,
    rule: 'required',
  },
  businessGoal: {
    value: '',
    values: [
      { label: 'Launch New Business', icon: 'ns-new-business', value: BUSINESS_GOAL.BRAND_NEW },
      { label: 'Open Franchise', icon: 'ns-franchise', value: BUSINESS_GOAL.FRANCHISE },
      { label: 'Expand/Upgrade Existing Business', icon: 'ns-expand-business', value: BUSINESS_GOAL.UPGRADE },
      { label: 'Create Off-shoot of Existing Business', icon: 'ns-off-shoot-business', value: BUSINESS_GOAL.RESTRUCTURE },
    ],
    error: undefined,
    rule: 'required',
  },
  fundUsage: {
    value: [],
    values: [
      { label: 'Renovations', icon: 'ns-renovations', value: 'RENOVATIONS' },
      { label: 'Equipment Purchase', icon: 'ns-equipment-purchase', value: 'EQUIPMENT_PURCHASE' },
      { label: 'Working Capital', icon: 'ns-working-capital', value: 'WORKING_CAPITAL' },
      { label: 'Inventory', icon: 'ns-inventory', value: 'INVENTORY' },
      { label: 'New product line', icon: 'ns-new-product', value: 'NEW_PRODUCT_LINE' },
      { label: 'New location', icon: 'ns-new-location', value: 'NEW_LOCATION' },
      { label: 'Restructure debt', icon: 'ns-restructure-debt', value: 'RESTRUCTURE_DEBT' },
      { label: 'Other use of funds', value: 'OTHER' },
    ],
    error: undefined,
    rule: 'required',
  },
  entityStructure: {
    value: '',
    values: [
      { label: 'Corporation', icon: 'ns-corporation', value: 'CORPORATION' },
      { label: 'LLC', icon: 'ns-business', value: 'LLC' },
      { label: 'Limited Partnership', icon: 'ns-partnership', value: 'LIMITED_PARTNERSHIP' },
      { label: 'Sole Proprietor', icon: 'ns-proprietor', value: 'SOLE_PROPRIETOR' },
      { label: 'Other', value: 'OTHER' },
    ],
    error: undefined,
    rule: 'required',
  },
  legalConfirmation: {
    value: [],
    values: [
      {
        label: 'The company has not raised securities under Regulation Crowdfunding in the last 12 months.',
        value: 'HAS_NOT_RAISED_SECURITIES',
      },
      {
        label: 'The company is not concurrently conducting an offering on another platform.',
        value: 'IS_NOT_CONDUCTING_OFFERING',
      },
      {
        label: 'The company is not a broker-dealer.',
        value: 'IS_NOT_BROKER_DEALER',
      },
      {
        label: 'The company is organized in the United States',
        value: 'IS_ORGANIZED_IN_USA',
      },
      {
        label: 'The company is not an investment company.',
        value: 'IS_NOT_INVESTMENT_COMPANY',
      },
      {
        label: 'The company has not sold securities registered under the Securities Exchange Act of 1934.',
        value: 'HAS_NOT_SOLD_SECURITIES',
      },
      {
        label: 'I have never filed for bankruptcy.',
        value: 'HAS_NEVER_FILED_BANKRUPTCY',
        tooltip: 'If you have filed for bankruptcy, a NextSeed representative may follow up to verity the details of the bankruptcy',
      },
      {
        label: 'I am not currently charged with or have ever been convicted of fraud.',
        value: 'HAS_NEVER_BEEN_CONVICTED_OF_FRAUD',
      },
      {
        label: 'I am not currently charged with or have ever been convicted of a serious criminal offense.',
        value: 'HAS_NEVER_BEEN_CONVICTED_OF_CRIMINAL_OFFENCE',
      },
    ],
    error: undefined,
    rule: 'array',
  },
};

export const BUSINESS_SIGNUP = {
  emailAddress: {
    value: '', label: 'E-mail address', error: undefined, rule: 'required', placeHolder: 'e.g. john.doe@contact.com',
  },
  password: {
    value: '', label: 'Password', error: undefined, rule: 'required', placeHolder: 'Password',
  },
};

export const BUSINESS_DETAILS = {
  businessPlan: {
    value: '', label: 'Upload your business plan', error: undefined, rule: 'required',
  },
  existingDebt1: {
    value: '', label: 'Existing Debt 1', error: undefined, rule: 'required', placeHolder: '500,000',
  },
  remainingPrincipal: {
    value: '', label: 'Remaining Principal', error: undefined, rule: 'required', placeHolder: '500,000',
  },
  interestExpenses: {
    value: '', label: 'Interest Expenses', error: undefined, rule: 'required', placeHolder: '10.0 %',
  },
  termMonths: {
    value: '', label: 'Term (in months)', error: undefined, rule: 'required', placeHolder: '5',
  },
  fullLegalName: {
    value: '', label: 'Full Legal Name', error: undefined, rule: 'required', placeHolder: 'John Doe',
  },
  yearsExperience: {
    value: '', label: 'Years Experience', error: undefined, rule: 'required', placeHolder: '5',
  },
  ssnNumber: {
    value: '', label: 'SSN', error: undefined, rule: 'required', placeHolder: '123-456-7890',
  },
  ownershipOfCompany: {
    value: '', label: 'Ownership of Company', error: undefined, rule: 'required', placeHolder: '40.0%',
  },
  linkedInURL: {
    value: '', label: 'LinkedIn URL', error: undefined, rule: 'optional', placeHolder: 'http://linkedin.com/username',
  },
  title: {
    value: '', label: 'Title', error: undefined, rule: 'required', placeHolder: 'e.g. CEO',
  },
  ownerResume: {
    value: '', label: 'Upload Resume/CV', error: undefined, rule: 'required',
  },
};

export const BUSINESS_PERF = {
  prior3YrStatement: {
    value: '', label: 'Prior 3 Year Statement', error: undefined, rule: 'required',
  },
  ytdStatements: {
    value: '', label: 'YTD Statements', error: undefined, rule: 'required',
  },
  fiveYrProjections: {
    value: '', label: '5 Year Projections', error: undefined, rule: 'required',
  },
  pyGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: '1,250,000',
  },
  pyOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: '100,000',
  },
  pyNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: '550,000',
  },
  pyCogs: {
    value: '', label: 'COGS', error: undefined, rule: 'required', placeHolder: '550,000',
  },
  fyGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: '1,250,000',
  },
  fyOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: '100,000',
  },
  fyNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: '550,000',
  },
  fyCogs: {
    value: '', label: 'COGS', error: undefined, rule: 'required', placeHolder: '550,000',
  },
};

export const BUSINESS_DOC = {
  bankStatements: {
    value: '', label: 'Prior 6 months Bank Statements', error: undefined, rule: 'required',
  },
  leaseAgreement: {
    value: '', label: 'Lease Agreement / Letter of Intent', error: undefined, rule: 'required',
  },
  blanketLien: {
    value: '0',
    values: [
      { label: 'Yes', value: '0' },
      { label: 'No', value: '1' },
    ],
    error: undefined,
    rule: 'required',
  },
  personalGuarantee: {
    value: '0',
    values: [
      { label: 'Yes', value: '0' },
      { label: 'No', value: '1' },
    ],
    error: undefined,
    rule: 'required',
  },
  personalGuaranteeForm: {
    value: '', label: 'Personal Guarantee Form', error: undefined, rule: 'required',
  },
};

export const LENDIO_PRE_QUAL = {
  businessName: {
    value: '',
    label: 'Business Name (or anticipated name)',
    error: undefined,
    rule: 'required|string',
    placeHolder: 'e.g. NextBrewery',
  },
  businessOwnerName: {
    value: '', label: 'Business Owner\'s Full Name', error: undefined, rule: 'required', placeHolder: 'e.g. John Doe',
  },
  emailAddress: {
    value: '', label: 'Email Address', error: undefined, rule: 'required|email', placeHolder: 'e.g.next.brewery@contact.com',
  },
  phoneNumber: {
    value: '', label: 'Best Contact Phone Number', error: undefined, rule: 'required', placeHolder: '(123) 456 789',
  },
  comments: {
    value: '', label: 'Comments (Optional)', error: undefined, rule: 'alpha_num', placeHolder: 'Add your comments here',
  },
  yrsInBusiness: {
    value: '', error: undefined, rule: 'required', label: 'How long you have been in business?',
  },
  avgSales: {
    value: '', error: undefined, rule: 'required', label: 'What are your average monthly sales before expenses?',
  },
  personalCreditRating: {
    value: '', error: undefined, rule: 'required', label: 'How would you rate your personal credit?',
  },
  industryType: {
    value: '', error: undefined, rule: 'required', label: 'What type of industry is your business in?',
  },
  money: {
    value: '', error: undefined, rule: 'required', label: 'How much money you are looking for today? (Optional)',
  },
};
