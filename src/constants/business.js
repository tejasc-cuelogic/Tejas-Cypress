export const FORM_VALUES = [
  { name: 'name_of_business', placeholder: 'Business Name' },
  { name: 'shorthand_name', placeholder: 'Shorthand Name' },
  { name: 'type_of_business', placeholder: 'Business Type' },
  { name: 'state_of_formation', placeholder: 'State of Formation' },
  { name: 'investment_multiple', placeholder: 'Investment Multiple' },
  { name: 'revenue_share_percentage', placeholder: 'Percent Share in revenue' },
  { name: 'minimum_offering_amount', placeholder: 'Minimum offering amount' },
  { name: 'offering_amount', placeholder: 'Offering Amount' },
  { name: 'maturity_date', placeholder: 'Maturity Date' },
  { name: 'termination_date', placeholder: 'Termination Date' },
  { name: 'offer_date', placeholder: 'Offer Date' },
  { name: 'interest_rate', placeholder: 'Interest Rate' },
];

export const DOCFILE_TYPES = {
  'Form C Issuer Certificate.docx': false,
  'Form Security Agreement.docx': false,
  'Form of Note Purchase Agreement - Revenue Share.docx': false,
  'Form of Note Purchase Agreement - Term Note.docx': false,
  'Goldstar Escrow Agreement (Form).docx': false,
  'National - Template Disclosure Statement (Rev).docx': false,
  'National - Template Disclosure Statement (Term).docx': false,
  'National Portal - Form of Crowdfunding Portal Agreement (Rev Share).docx': false,
  'National Portal - Form of Crowdfunding Portal Agreement (Term).docx': false,
  'Resolution - Borrowing Authority (Form).docx': false,
};

export const FILER_INFORMATION = {
  filerCik: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  filerCcc: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  liveTestFlag: {
    value: 'TEST',
    error: undefined,
    rule: 'required',
  },
  confirmingCopyFlag: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  returnCopyFlag: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  overrideInternetFlag: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  contactName: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  contactPhone: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  contactEmail: {
    value: '',
    error: undefined,
    rule: 'required|email',
  },
};

export const ISSUER_INFORMATION = {
  nameOfIssuer: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  legalStatusForm: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  jurisdictionOrganization: {
    value: '',
    error: undefined,
    rule: '',
  },
  dateIncorporation: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  street1: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  street2: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  city: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  stateOrCountry: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  zipCode: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  issuerWebsite: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  companyName: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  commissionCik: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  commissionFileNumber: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  cardNumber: {
    value: '',
    error: undefined,
    rule: 'required',
  },
};

export const OFFERING_INFORMATION = {
  compensationAmount: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  financialInterest: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  securityOfferedType: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  priceDeterminationMethod: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  offeringAmount: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  overSubscriptionAccepted: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  overSubscriptionAllocationType: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  maximumOfferingAmount: {
    value: '',
    error: undefined,
    rule: 'required',
  },
  deadlineDate: {
    value: '',
    error: undefined,
    rule: 'required',
  },
};

export const ANNUAL_REPORT_REQUIREMENTS = {
  currentEmployees: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'currentEmployees',
    label: 'Current Number of Employees',

  },
  totalAssetMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'totalAssetMostRecentFiscalYear',
    label: 'Total Assets Most Recent Fiscal Year-end',
  },
  totalAssetPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'totalAssetPriorFiscalYear',
    label: 'Total Assets Prior Fiscal Year-end',
  },
  cashEquiMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'cashEquiMostRecentFiscalYear',
    label: 'Cash and Cash Equivalents Most Recent Fiscal Year-end',
  },
  cashEquiPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'cashEquiPriorFiscalYear',
    label: 'Cash and Cash Equivalents Prior Fiscal Year-end',
  },
  actReceivedMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'actReceivedMostRecentFiscalYear',
    label: 'Accounts Receivable Most Recent Fiscal Year-end',
  },
  actReceivedPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'actReceivedPriorFiscalYear',
    label: 'Accounts Receivable Prior Fiscal Year-end',
  },
  shortTermDebtMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'shortTermDebtMostRecentFiscalYear',
    label: 'Short-term Debt Most Recent Fiscal Year-end',
  },
  shortTermDebtPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'shortTermDebtPriorFiscalYear',
    label: 'Short-term Debt Prior Fiscal Year-end',
  },
  longTermDebtMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'longTermDebtMostRecentFiscalYear',
    label: 'Long-term Debt Most Recent Fiscal Year-end',
  },
  longTermDebtPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'longTermDebtPriorFiscalYear',
    label: 'Long-term Debt Prior Fiscal Year-end',
  },
  revenueMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'revenueMostRecentFiscalYear',
    label: 'Revenue/Sales Most Recent Fiscal Year-end',
  },
  revenuePriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'revenuePriorFiscalYear',
    label: 'Revenue/Sales Prior Fiscal Year-end',
  },
  costGoodsSoldMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'costGoodsSoldMostRecentFiscalYear',
    label: 'Cost of Goods Sold Most Recent Fiscal Year-end',
  },
  costGoodsSoldPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'costGoodsSoldPriorFiscalYear',
    label: 'Cost of Goods Sold Prior Fiscal Year-end',
  },
  taxPaidMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'taxPaidMostRecentFiscalYear',
    label: 'Taxes Paid Most Recent Fiscal Year-end',
  },
  taxPaidPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'taxPaidPriorFiscalYear',
    label: 'Taxes Paid Prior Fiscal Year-end',
  },
  netIncomeMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'netIncomeMostRecentFiscalYear',
    label: 'Net Income Most Recent Fiscal Year-end',
  },
  netIncomePriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required',
    key: 'netIncomePriorFiscalYear',
    label: 'Net Income Prior Fiscal Year-end',
  },
  issueJurisdictionSecuritiesOffering: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'issueJurisdictionSecuritiesOffering',
    label: 'Using the list below, select the jurisdictions in which the issuer intends to offer the securities',
  },
};

export const SIGNATURE = {
  issuer: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'issuer',
    label: 'Issuer',
  },
  issuerSignature: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'issuerSignature',
    label: 'Signature',
  },
  issuerTitle: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'issuerTitle',
    label: 'Title',
  },
  signaturePerson: [
    {
      id: 'qwertf',
      personSignature: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'personSignature',
        label: 'Signature',
      },
      personTitle: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'personTitle',
        label: 'Title',
      },
      signatureDate: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'signatureDate',
        label: 'Date',
      },
    },
    {
      id: 'jhgirng',
      personSignature: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'personSignature',
        label: 'Signature',
      },
      personTitle: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'personTitle',
        label: 'Title',
      },
      signatureDate: {
        value: '',
        error: undefined,
        rule: 'required',
        key: 'signatureDate',
        label: 'Date',
      },
    },
  ],
};

export const PERSONAL_SIGNATURE = {
  id: '',
  personSignature: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'personSignature',
    label: 'Signature',
  },
  personTitle: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'personTitle',
    label: 'Title',
  },
  signatureDate: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'signatureDate',
    label: 'Date',
  },
};

export const COUNTRIES = [
  { key: 'AL', value: 'AL', text: 'ALABAMA' },
  { key: 'AK', value: 'AK', text: 'ALASKA' },
  { key: 'AZ', value: 'AZ', text: 'ARIZONA' },
  { key: 'AR', value: 'AR', text: 'ARKANSAS' },
  { key: 'CA', value: 'CA', text: 'CALIFORNIA' },
  { key: 'CO', value: 'CO', text: 'COLORADO' },
  { key: 'CT', value: 'CT', text: 'CONNECTICUT' },
  { key: 'DE', value: 'DE', text: 'DELAWARE' },
  { key: 'DC', value: 'DC', text: 'DISTRICT OF COLUMBIA' },
  { key: 'FL', value: 'FL', text: 'FLORIDA' },
  { key: 'GA', value: 'GA', text: 'GEORGIA' },
  { key: 'GU', value: 'GU', text: 'GUAM' },
  { key: 'HI', value: 'HI', text: 'HAWAII' },
  { key: 'ID', value: 'ID', text: 'IDAHO' },
  { key: 'IL', value: 'IL', text: 'ILLINOIS' },
  { key: 'IN', value: 'IN', text: 'INDIANA' },
  { key: 'IA', value: 'IA', text: 'IOWA' },
  { key: 'KS', value: 'KS', text: 'KANSAS' },
  { key: 'KY', value: 'KY', text: 'KENTUCKY' },
  { key: 'LA', value: 'LA', text: 'LOUISIANA' },
  { key: 'ME', value: 'ME', text: 'MAINE' },
  { key: 'MD', value: 'MD', text: 'MARYLAND' },
  { key: 'MA', value: 'MA', text: 'MASSACHUSETTS' },
  { key: 'MI', value: 'MI', text: 'MICHIGAN' },
  { key: 'MN', value: 'MN', text: 'MINNESOTA' },
  { key: 'MS', value: 'MS', text: 'MISSISSIPPI' },
  { key: 'MO', value: 'MO', text: 'MISSOURI' },
  { key: 'MT', value: 'MT', text: 'MONTANA' },
  { key: 'NE', value: 'NE', text: 'NEBRASKA' },
  { key: 'NV', value: 'NV', text: 'NEVADA' },
  { key: 'NH', value: 'NH', text: 'NEW HAMPSHIRE' },
  { key: 'NJ', value: 'NJ', text: 'NEW JERSEY' },
  { key: 'NM', value: 'NM', text: 'NEW MEXICO' },
  { key: 'NY', value: 'NY', text: 'NEW YORK' },
  { key: 'NC', value: 'NC', text: 'NORTH CAROLINA' },
  { key: 'ND', value: 'ND', text: 'NORTH DAKOTA' },
  { key: 'OH', value: 'OH', text: 'OHIO' },
  { key: 'OK', value: 'OK', text: 'OKLAHOMA' },
  { key: 'OR', value: 'OR', text: 'OREGON' },
  { key: 'PA', value: 'PA', text: 'PENNSYLVANIA' },
  { key: 'PR', value: 'PR', text: 'PUERTO RICO' },
  { key: 'RI', value: 'RI', text: 'RHODE ISLAND' },
  { key: 'SC', value: 'SC', text: 'SOUTH CAROLINA' },
  { key: 'SD', value: 'SD', text: 'SOUTH DAKOTA' },
  { key: 'TN', value: 'TN', text: 'TENNESSEE' },
  { key: 'TX', value: 'TX', text: 'TEXAS' },
  { key: 'UT', value: 'UT', text: 'UTAH' },
  { key: 'VT', value: 'VT', text: 'VERMONT' },
  { key: 'VI', value: 'VI', text: 'VIRGIN ISLANDS, U.S.' },
  { key: 'VA', value: 'VA', text: 'VIRGINIA' },
  { key: 'WA', value: 'WA', text: 'WASHINGTON' },
  { key: 'WV', value: 'WV', text: 'WEST VIRGINIA' },
  { key: 'WI', value: 'WI', text: 'WISCONSIN' },
  { key: 'WY', value: 'WY', text: 'WYOMING' },
  { key: 'B5', value: 'B5', text: 'AMERICAN SAMOA' },
  { key: '1V', value: '1V', text: 'NORTHERN MARIANA ISLANDS' },
];

export const EDGAR_URL = '/edgar/publish';

export const XML_URL = '/edgar/primary-data';

export const GRAPHQL = '/graphql';
