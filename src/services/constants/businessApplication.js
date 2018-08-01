import React from 'react';

export const BUSINESS_GOAL = {
  UPGRADE: 'UPGRADE',
  RESTRUCTURE: 'RESTRUCTURE',
  BRAND_NEW: 'BRAND_NEW',
  FRANCHISE: 'FRANCHISE',
};

export const BUSINESS_APPLICATION_STATUS = {
  PRE_QUALIFICATION_FAILED: 'PRE_QUALIFICATION_FAILED',
  PRE_QUALIFICATION_SUCCESSFUL: 'PRE_QUALIFICATION_SUCCESSFUL',
  PRE_QUALIFICATION_SUBMITTED: 'PRE_QUALIFICATION_SUBMITTED',
  PRE_QUALIFICATION_PROMOTED: 'PRE_QUALIFICATION_PROMOTED',
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_REVIEWED: 'APPLICATION_REVIEWED',
  APPLICATION_FAILED: 'APPLICATION_FAILED',
  APPLICATION_SUCCESSFUL: 'APPLICATION_SUCCESSFUL',
  REVIEWED: 'REVIEWED',
  DECLINED: 'DECLINED',
  APPLICATION_DELETED: 'APPLICATION_DELETED',
  LENDIO_PRE_QUALIFICATION_SUCCESSFUL: 'LENDIO_PRE_QUALIFICATION_SUCCESSFUL',
  LENDIO_PRE_QUALIFICATION_FAILED: 'LENDIO_PRE_QUALIFICATION_FAILED',
  LENDIO_SUCCESS: 'SUCCESS',
};

export const BUSINESS_APP_USER_STATUS = {
  PRE_QUALIFICATION_FAILED: { status: 'Not Eligible', icon: 'ns-reload-circle-line', color: 'orange' },
  PRE_QUALIFICATION_SUCCESSFUL: { status: 'In-progress', icon: 'ns-reload-circle-line', color: 'orange' },
  PRE_QUALIFICATION_SUBMITTED: { status: 'In-progress', icon: 'ns-pencil-circle-line', color: '' },
  PRE_QUALIFICATION_PROMOTED: { status: 'Promoted', icon: 'ns-reload-circle-line', color: '' },
  APPLICATION_SUBMITTED: { status: 'Pending Review', icon: 'ns-check-circle-line', color: 'green' },
  APPLICATION_REVIEWED: { status: 'Reviewed', icon: 'ns-reload-circle-line', color: '' },
  APPLICATION_FAILED: { status: 'Failed', icon: 'ns-reload-circle-line', color: '' },
  APPLICATION_SUCCESSFUL: { status: 'Successful', icon: 'ns-reload-circle-line', color: '' },
  REVIEWED: { status: 'Reviewed', icon: 'ns-reload-circle-line', color: '' },
  DECLINED: { status: 'Declined Offer', icon: 'ns-reload-circle-line', color: '' },
  APPLICATION_DELETED: { status: 'Deleted', icon: 'ns-reload-circle-line', color: '' },
};

export const BUSINESS_APP_FILE_UPLOAD_ENUMS = {
  businessPlan: 'BUSINESS_PLAN',
  resume1: 'OWNER1',
  resume2: 'OWNER2',
  resume3: 'OWNER3',
  resume4: 'OWNER4',
  resume5: 'OWNER5',
  ytd: 'YTD_STATEMENT',
  priorToThreeYear: 'PRIOR_YEAR_STATEMENTS',
  fiveYearProjection: 'PROJECTIONS',
  personalTaxReturn: 'PERSONAL_TAX',
  businessTaxReturn: 'BUSINESS_TAX',
  leaseAgreementsOrLOIs: 'LEASE',
  bankStatements: 'BANK_STATEMENTS',
  personalGuaranteeForm: 'PERSONAL_GUARANTEE',
};

export const BUSINESS_PRE_QUALIFICATION = {
  businessModel: {
    value: '',
    values: [
      { label: 'Business to Consumer', value: 'B2C' },
      { label: 'Business to Business', value: 'B2B' },
    ],
    error: undefined,
    rule: 'required',
    customErrors: { required: 'required' },
  },
  businessName: {
    value: '', label: 'Business Name', error: undefined, rule: 'required|string', placeHolder: 'e.g.  NextBrewery', customErrors: { required: 'required' },
  },
  website: {
    value: '', label: 'Website', error: undefined, rule: 'required|url', placeHolder: 'e.g.  http://nextbrewery.com', customErrors: { required: 'required' },
  },
  phoneNumber: {
    value: '', label: 'Phone Number', error: undefined, rule: 'required|maskedField:10', placeHolder: '(123)-456-7890', customErrors: { required: 'required', maskedField: 'required' },
  },
  street: {
    value: '', label: 'Street', error: undefined, rule: 'required', placeHolder: 'e.g.  NextBrewery', customErrors: { required: 'required' },
  },
  city: {
    value: '', label: 'City', error: undefined, rule: 'required', placeHolder: 'e.g.  NY', customErrors: { required: 'required' },
  },
  state: {
    value: '', label: 'State', error: undefined, rule: 'required', placeHolder: 'e.g.  NY', customErrors: { required: 'required' },
  },
  zipCode: {
    value: '', label: 'Zip Code', error: undefined, rule: 'required|numeric', placeHolder: '10012', maxLength: 6, customErrors: { required: 'required' },
  },
  industryExperience: {
    value: '',
    label: 'How many years of related industry experience does your team have?',
    error: undefined,
    rule: 'required|numeric',
    maxLength: 2,
    placeHolder: 'e.g. 5',
    customErrors: { required: 'required' },
  },
  businessAgeYears: {
    value: '', maxLength: 4, label: 'Years', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: '1', customErrors: { required: 'required' },
  },
  businessAgeMonths: {
    value: '', maxLength: 2, label: 'Months', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: '3', customErrors: { required: 'required' },
  },
  franchiseHolder: {
    value: '',
    values: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    error: undefined,
    rule: 'required_if:businessGoal,FRANCHISE',
    customErrors: { required: 'required' },
  },
  estimatedCreditScore: {
    value: '', maxLength: 8, label: 'What is your estimated credit score?', error: undefined, rule: 'required|numeric', placeHolder: 'e.g. 700', customErrors: { required: 'required' },
  },
  totalProjectCost: {
    value: '', maxLength: 16, label: 'What’s the total project cost?', error: undefined, rule: 'required', placeHolder: 'e.g. $100,000', customErrors: { required: 'required' },
  },
  amountNeeded: {
    value: '',
    maxLength: 16,
    label: 'How much do you need to raise on NextSeed?',
    error: undefined,
    rule: 'required',
    customErrors: { required: 'required' },
    placeHolder: 'e.g. $50,000',
    tooltip: (<span>Minimum amount of funding is $50,000. For requirements on different levels of funding, <a className="inverted" href="/business" target="_blank">click here.</a></span>),
  },
  previousYearGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. $750,000', customErrors: { required: 'required' },
  },
  previousYearCogSold: {
    value: '', label: 'Cost of Goods Sold', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. $75,000', customErrors: { required: 'required' },
  },
  previousYearOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. $150,000', customErrors: { required: 'required' },
  },
  previousYearNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required_if:businessGoal,UPGRADE|required_if:businessGoal,RESTRUCTURE', placeHolder: 'e.g. $525,000', customErrors: { required: 'required' },
  },
  nextYearGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: 'e.g. $750,000', customErrors: { required: 'required' },
  },
  nextYearCogSold: {
    value: '', label: 'Cost of Goods Sold', error: undefined, rule: 'required', placeHolder: 'e.g. $75,000', customErrors: { required: 'required' },
  },
  nextYearOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: 'e.g. $150,000', customErrors: { required: 'required' },
  },
  nextYearNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: 'e.g. $525,000', customErrors: { required: 'required' },
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
    customErrors: { required: 'required' },
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
    customErrors: { required: 'required' },
  },
  fundUsage: {
    value: [],
    values: [
      { label: 'Renovations', icon: 'ns-renovations', value: 'RENOVATIONS' },
      { label: 'Equipment Purchase', icon: 'ns-equipment-purchase', value: 'EQUIPMENT_PURCHASE' },
      { label: 'Working Capital', icon: 'ns-working-capital', value: 'WORKING_CAPITAL' },
      { label: 'Inventory', icon: 'ns-inventory', value: 'INVENTORY' },
      { label: 'New Product Line', icon: 'ns-new-product', value: 'NEW_PRODUCT_LINE' },
      { label: 'New Location', icon: 'ns-new-location', value: 'NEW_LOCATION' },
      { label: 'Restructure Debt', icon: 'ns-restructure-debt', value: 'RESTRUCTURE_DEBT' },
      { label: 'Other Industry Type', value: 'OTHER' },
    ],
    error: undefined,
    rule: 'required',
    customErrors: { required: 'required' },
  },
  businessEntityStructure: {
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
    customErrors: { required: 'required' },
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
        label: 'The company is organized in the United States.',
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
        tooltip: 'If you have filed for bankruptcy, a NextSeed representative may follow up to verity the details of the bankruptcy.',
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
    value: [], label: 'Upload your business plan', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  debts: [{
    amount: {
      value: 0, label: 'Existing Debt', error: undefined, rule: 'required', placeHolder: '500,000', customErrors: { required: 'required' },
    },
    remainingPrincipal: {
      value: 0, label: 'Remaining Principal', error: undefined, rule: 'required', placeHolder: '500,000', customErrors: { required: 'required' },
    },
    interestExpenses: {
      value: 0, label: 'Interest Expenses', error: undefined, rule: 'required', placeHolder: '10.0 %', customErrors: { required: 'required' },
    },
    term: {
      value: 0, label: 'Term (in months)', error: undefined, rule: 'required', placeHolder: '5', customErrors: { required: 'required' },
    },
  }],
  owners: [{
    fullLegalName: {
      value: '', label: 'Full Legal Name', error: undefined, rule: 'required', placeHolder: 'John Doe', customErrors: { required: 'required' },
    },
    yearsOfExp: {
      value: '', label: 'Years Experience', error: undefined, rule: 'required', placeHolder: '5', customErrors: { required: 'required' },
    },
    ssn: {
      value: '', label: 'SSN', error: undefined, rule: 'required|maskedField:9', placeHolder: '123-46-7890', customErrors: { required: 'required', maskedField: 'required' },
    },
    companyOwnerShip: {
      value: '', label: 'Ownership of Company', error: undefined, rule: 'required|ownerPercentage:companyOwnerShip', placeHolder: '40.0%', customErrors: { required: 'required' },
    },
    linkedInUrl: {
      value: '', label: 'LinkedIn URL', error: undefined, rule: 'optional|url', placeHolder: 'http://linkedin.com/username', customErrors: { required: 'required', url: 'Please enter valid URL.' },
    },
    title: {
      value: '', label: 'Title', error: undefined, rule: 'optional', placeHolder: 'e.g. CEO', customErrors: { required: 'required' },
    },
    resume: {
      value: '', label: 'Upload Resume/CV', error: undefined, rule: 'required', showLoader: false, preSignedUrl: '', fileId: '', fileData: '', customErrors: { required: 'required' },
    },
  }],
};

export const BUSINESS_PERF = {
  priorToThreeYear: {
    value: [], label: 'Prior 3 Year Statements', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  ytd: {
    value: [], label: 'YTD Statements', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  fiveYearProjection: {
    value: [], label: '5 Year Projections', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  pyGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: 'e.g. $1,250,000', customErrors: { required: 'required' },
  },
  pyOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: 'e.g. $100,000', customErrors: { required: 'required' },
  },
  pyNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: 'e.g. $550,000', customErrors: { required: 'required' },
  },
  pyCogs: {
    value: '', label: 'COGS', error: undefined, rule: 'required', placeHolder: 'e.g. $550,000', customErrors: { required: 'required' },
  },
  nyGrossSales: {
    value: '', label: 'Gross Sales', error: undefined, rule: 'required', placeHolder: 'e.g. $1,250,000', customErrors: { required: 'required' },
  },
  nyOperatingExpenses: {
    value: '', label: 'Operating Expenses', error: undefined, rule: 'required', placeHolder: 'e.g. $100,000', customErrors: { required: 'required' },
  },
  nyNetIncome: {
    value: '', label: 'Net Income', error: undefined, rule: 'required', placeHolder: 'e.g. $550,000', customErrors: { required: 'required' },
  },
  nyCogs: {
    value: '', label: 'COGS', error: undefined, rule: 'required', placeHolder: 'e.g. $550,000', customErrors: { required: 'required' },
  },
};

export const BUSINESS_DOC = {
  bankStatements: {
    value: [], label: 'Prior 6 months Bank Statements', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  leaseAgreementsOrLOIs: {
    value: [], label: 'Lease Agreement / Letter of Intent', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], tooltip: 'NextSeed requires a lease or LOI prior to launching your campaign. Before disbursing funds, the executed lease is required. If you are currently still in negotiations with your lease, please submit a draft of the current terms.', customErrors: { required: 'required' },
  },
  personalTaxReturn: {
    value: [], label: 'Prior 2 Years of Personal Tax Returns', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  businessTaxReturn: {
    value: [], label: 'Prior 3 Years of Business Tax Returns', error: undefined, rule: 'required', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required: 'required' },
  },
  blanketLien: {
    value: '',
    values: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    error: undefined,
    rule: 'required',
  },
  personalGuarantee: {
    value: '',
    values: [
      { label: 'Yes', value: 'true' },
      { label: 'No', value: 'false' },
    ],
    error: undefined,
    rule: 'required',
  },
  personalGuaranteeForm: {
    value: [], label: 'Personal Guarantee Form', error: undefined, rule: 'required_if:personalGuarantee,true', showLoader: false, preSignedUrl: [], fileId: [], fileData: [], customErrors: { required_if: 'required' },
  },
};

export const LENDIO_PRE_QUAL = {
  businessName: {
    value: '',
    label: 'Business Name (or anticipated name)',
    error: undefined,
    rule: 'required|string',
    placeHolder: 'e.g.  NextBrewery',
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
  industry: {
    value: '', error: undefined, rule: 'required', label: 'What type of industry is your business in?',
  },
  raiseAmount: {
    value: '', error: undefined, rule: 'required', label: 'How much money you are looking for today? (Optional)',
  },
  applicationAgreeConditions: {
    value: ['agreeConditions'],
    values: [
      {
        label: 'I agree to the conditions above.', value: 'agreeConditions',
      },
      {
        label: 'I agree to send data to Lendio, our partner.', value: 'sendDataToLendio',
      },
    ],
    error: undefined,
    rule: 'array',
  },
};

// Affiliated partners
export const AFFILIATED_PARTNERS = {
  LENDIO: 'LENDIO',
};

// Lendio partner related data
export const LENDIO = {
  PRE_QUALIFICATION_SUCCESSFUL: 'LENDIO_PRE_QUALIFICATION_SUCCESSFUL',
  PRE_QUALIFICATION_FAILED: 'LENDIO_PRE_QUALIFICATION_FAILED',
  LENDIO_SUCCESS: 'SUCCESS',
  LENDING_PARTNER_LENDIO_DURATION_MAP: {
    2: 'DURATION_0_2_MONTHS', // 0-2 months
    5: 'DURATION_3_5_MONTHS', // 3-5 months
    11: 'DURATION_6_11_MONTHS', // 6-11 months
    23: 'DURATION_1_2_YEARS', // 1-2 years
    35: 'DURATION_2_3_YEARS', // 2-3 years
    59: 'DURATION_3_5_YEARS', // 3-5 years
    60: 'DURATION_5_OR_MORE_YEARS', // 5 or more years
  },
  LENDING_PARTNER_LENDIO_MO_SALES_MAP: {
    0: 'NO_REVENUES', // '$0, No Revenues'
    4000: 'AVERAGE_MONTHLY_SALES_1_4000', // '$1 - $4,000'
    8000: 'AVERAGE_MONTHLY_SALES_4001_8000', // '$4,001 - $8,000'
    15000: 'AVERAGE_MONTHLY_SALES_8001_15000', // '$8,001 - $15,000'
    20000: 'AVERAGE_MONTHLY_SALES_15001_20000', // '$15,001 - $20,000'
    40000: 'AVERAGE_MONTHLY_SALES_20001_40000', // '$20,001 - $40,000'
    80000: 'AVERAGE_MONTHLY_SALES_40001_80000', // '$40,001 - $80,000'
    200000: 'AVERAGE_MONTHLY_SALES_80001_200000', // '$80,001 - $200,000'
    400000: 'AVERAGE_MONTHLY_SALES_200001_400000', // '$200,001 - $400,000'
    400001: 'GREATER_THAN_400000', // 'More than $400,000'
  },
  LENDING_PARTNER_LENDIO_SALES_CREDIT_MAP: {
    499: 'POOR', // '(499 or Below) Poor'
    599: 'NOT_SO_GOOD', // '(500 - 599) Not so Good'
    649: 'OKAY', // '(600 - 649) Okay'
    679: 'GOOD', // '(650 - 679) Good',
    719: 'GREAT', // '(680 - 719) Great',
    720: 'EXCELLENT', // '(720 or Higher) Excellent'
  },
  LENDING_PARTNER_LENDIO_RAISE_AMT_MAP: {
    5000: 'AMT_1_5000', // '$1 - $5,000'
    25000: 'AMT_5001_25000', // '$5,001 - $25,000'
    50000: 'AMT_25001_50000', // '$25,001 - $50,000'
    100000: 'AMT_50001_100000', // '$50,001 - $100,000'
    250000: 'AMT_100001_250000', // '$100,001 - $250,000'
    500000: 'AMT_250001_500000', // '$250,001 - $500,000'
    1000000: 'AMT_500001_1M', // '$500,001 - $1M'
    1000001: 'GREATER_THAN_1M', // 'Over $1M'
  },
};
