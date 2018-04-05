import moment from 'moment';
import shortid from 'shortid';

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

export const DOCFILE_TYPES = [];

export const FILES = [
  'Form C Issuer Certificate.docx',
  'Form Security Agreement.docx',
  'Form of Note Purchase Agreement - Revenue Share.docx',
  'Form of Note Purchase Agreement - Term Note.docx',
  'Goldstar Escrow Agreement (Form).docx',
  'National - Template Disclosure Statement (Rev).docx',
  'National - Template Disclosure Statement (Term).docx',
  'National Portal - Form of Crowdfunding Portal Agreement (Rev Share).docx',
  'National Portal - Form of Crowdfunding Portal Agreement (Term).docx',
  'Resolution - Borrowing Authority (Form).docx',
];

export const TEMPLATE_VARIABLES = {
  name_of_business: '',
  shorthand_name: '',
  investment_multiple: '',
  revenue_share_percentage: '',
  minimum_offering_amount: '',
  offering_amount: '',
  maturity_date: '',
  interest_rate: '',
  offer_date: '',
  state_of_formation: '',
  type_of_business: '',
  termination_date: '',
};

export const PERSONAL_SIGNATURE = {
  id: shortid.generate(),
  personSignature: {
    value: '',
    error: undefined,
    rule: 'required|max:150',
    key: 'personSignature',
    label: 'Signature',
  },
  personTitle: {
    value: '',
    error: undefined,
    rule: 'required|max:256',
    key: 'personTitle',
    label: 'Title',
  },
  signatureDate: {
    value: moment(),
    error: undefined,
    rule: 'required',
    key: 'signatureDate',
    label: 'Date',
  },
};

export const FILER_INFORMATION = {
  filerCik: {
    value: '',
    key: 'filerCik',
    error: undefined,
    rule: 'required|max:10',
    content: 'Please enter CIK of filer',
  },
  filerCcc: {
    value: '',
    key: 'filerCcc',
    error: undefined,
    rule: 'required|max:8',
  },
  fileNumber: {
    value: '',
    key: 'fileNumber',
    error: undefined,
    rule: 'max:17',
  },
  liveTestFlag: {
    value: 'TEST',
    key: 'liveTestFlag',
    error: undefined,
    rule: 'required|in:LIVE,TEST',
  },
  confirmingCopyFlag: {
    value: false,
    key: 'confirmingCopyFlag',
    error: undefined,
    rule: 'required|boolean',
  },
  returnCopyFlag: {
    value: false,
    key: 'returnCopyFlag',
    error: undefined,
    rule: 'required|boolean',
  },
  overrideInternetFlag: {
    value: false,
    key: 'overrideInternetFlag',
    error: undefined,
    rule: 'required|boolean',
  },
  contactName: {
    value: '',
    key: 'contactName',
    error: undefined,
    rule: 'required|max:30',
  },
  contactPhone: {
    value: '',
    key: 'contactPhone',
    error: undefined,
    rule: 'required|max:20',
  },
  contactEmail: {
    value: '',
    key: 'contactEmail',
    error: undefined,
    rule: 'email|max:80',
  },
  notificationEmail: {
    value: '',
    key: 'notificationEmail',
    error: undefined,
    rule: 'string',
  },
};

export const ISSUER_INFORMATION = {
  nameOfIssuer: {
    value: '',
    key: 'nameOfIssuer',
    error: undefined,
    rule: 'required|max:150',
  },
  legalStatusForm: {
    value: '',
    key: 'legalStatusForm',
    error: undefined,
    rule: 'required',
  },
  legalStatusOtherDesc: {
    value: '',
    key: 'legalStatusOtherDesc',
    error: undefined,
    rule: 'required_if:legalStatusForm,Other|max:256',
  },
  jurisdictionOrganization: {
    value: '',
    key: 'jurisdictionOrganization',
    error: undefined,
    rule: 'required',
  },
  dateIncorporation: {
    value: moment(),
    key: 'dateIncorporation',
    error: undefined,
    rule: 'required',
  },
  street1: {
    value: '',
    key: 'street1',
    error: undefined,
    rule: 'required|max:40',
  },
  street2: {
    value: '',
    key: 'street2',
    error: undefined,
    rule: 'max:40',
  },
  city: {
    value: '',
    key: 'city',
    error: undefined,
    rule: 'required|max:30',
  },
  stateOrCountry: {
    value: '',
    key: 'stateOrCountry',
    error: undefined,
    rule: 'required',
  },
  zipCode: {
    value: '',
    key: 'zipCode',
    error: undefined,
    rule: 'required|max:10',
  },
  issuerWebsite: {
    value: '',
    key: 'issuerWebsite',
    error: undefined,
    rule: 'required|max:256',
  },
  companyName: {
    value: 'NextSeed US LLC',
    key: 'companyName',
    error: undefined,
    rule: 'required|max:150',
  },
  commissionCik: {
    value: '0001667892',
    key: 'commissionCik',
    error: undefined,
    rule: 'required|max:10',
  },
  commissionFileNumber: {
    value: '007-00023',
    key: 'commissionFileNumber',
    error: undefined,
    rule: 'required',
  },
  crdNumber: {
    value: '283225',
    key: 'crdNumber',
    error: undefined,
    rule: 'max:9',
  },
};

export const OFFERING_INFORMATION = {
  compensationAmount: {
    value: '',
    key: 'compensationAmount',
    error: undefined,
    rule: 'required|max:256',
  },
  financialInterest: {
    value: '',
    key: 'financialInterest',
    error: undefined,
    rule: 'required|max:256',
  },
  securityOfferedType: {
    value: '',
    key: 'securityOfferedType',
    error: undefined,
    rule: 'required',
  },
  securityOfferedOtherDesc: {
    value: '',
    key: 'securityOfferedOtherDesc',
    error: undefined,
    rule: 'max:256|required_if:securityOfferedType,Other',
  },
  noOfSecurityOffered: {
    value: '',
    key: 'noOfSecurityOffered',
    error: undefined,
    rule: 'required_if:securityOfferedType,Other|required_if:securityOfferedType,Common Stock|' +
    'required_if:securityOfferedType,Preferred Stock|max:9999999999|numeric',
  },
  price: {
    value: '',
    key: 'price',
    error: undefined,
    rule: 'numeric|max:999999|regex:/[\\+\\-]?\\d{0,7}\\.\\d{5}/',
  },
  priceDeterminationMethod: {
    value: '',
    key: 'priceDeterminationMethod',
    error: undefined,
    rule: 'required',
  },
  offeringAmount: {
    value: '',
    key: 'offeringAmount',
    error: undefined,
    rule: 'required|numeric|max:9999999|regex:/[\\+\\-]?\\d{0,7}\\.\\d\\d/',
  },
  overSubscriptionAccepted: {
    value: 'Y',
    key: 'overSubscriptionAccepted',
    error: undefined,
    rule: 'required',
  },
  overSubscriptionAllocationType: {
    value: '',
    key: 'overSubscriptionAllocationType',
    error: undefined,
    rule: 'required_if:overSubscriptionAccepted,Y',
  },
  descOverSubscription: {
    value: '',
    key: 'descOverSubscription',
    error: undefined,
    rule: 'required_if:overSubscriptionAllocationType,Other|max:256',
  },
  maximumOfferingAmount: {
    value: '',
    key: 'maximumOfferingAmount',
    error: undefined,
    rule: 'required_if:overSubscriptionAccepted,Y|numeric|max:9999999|regex:/[\\+\\-]?\\d{0,7}\\.\\d\\d/',
  },
  deadlineDate: {
    value: moment(),
    key: 'deadlineDate',
    error: undefined,
    rule: 'required',
  },
};

export const ANNUAL_REPORT_REQUIREMENTS = {
  currentEmployees: {
    value: '0',
    error: undefined,
    rule: 'required|numeric|max:9999999|min:0',
    key: 'currentEmployees',
    label: 'Current Number of Employees',

  },
  totalAssetMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'totalAssetMostRecentFiscalYear',
    label: 'Total Assets Most Recent Fiscal Year-end',
  },
  totalAssetPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'totalAssetPriorFiscalYear',
    label: 'Total Assets Prior Fiscal Year-end',
  },
  cashEquiMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'cashEquiMostRecentFiscalYear',
    label: 'Cash and Cash Equivalents Most Recent Fiscal Year-end',
  },
  cashEquiPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'cashEquiPriorFiscalYear',
    label: 'Cash and Cash Equivalents Prior Fiscal Year-end',
  },
  actReceivedMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'actReceivedMostRecentFiscalYear',
    label: 'Accounts Receivable Most Recent Fiscal Year-end',
  },
  actReceivedPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'actReceivedPriorFiscalYear',
    label: 'Accounts Receivable Prior Fiscal Year-end',
  },
  shortTermDebtMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'shortTermDebtMostRecentFiscalYear',
    label: 'Short-term Debt Most Recent Fiscal Year-end',
  },
  shortTermDebtPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'shortTermDebtPriorFiscalYear',
    label: 'Short-term Debt Prior Fiscal Year-end',
  },
  longTermDebtMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'longTermDebtMostRecentFiscalYear',
    label: 'Long-term Debt Most Recent Fiscal Year-end',
  },
  longTermDebtPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'longTermDebtPriorFiscalYear',
    label: 'Long-term Debt Prior Fiscal Year-end',
  },
  revenueMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'revenueMostRecentFiscalYear',
    label: 'Revenue/Sales Most Recent Fiscal Year-end',
  },
  revenuePriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'revenuePriorFiscalYear',
    label: 'Revenue/Sales Prior Fiscal Year-end',
  },
  costGoodsSoldMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'costGoodsSoldMostRecentFiscalYear',
    label: 'Cost of Goods Sold Most Recent Fiscal Year-end',
  },
  costGoodsSoldPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'costGoodsSoldPriorFiscalYear',
    label: 'Cost of Goods Sold Prior Fiscal Year-end',
  },
  taxPaidMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'taxPaidMostRecentFiscalYear',
    label: 'Taxes Paid Most Recent Fiscal Year-end',
  },
  taxPaidPriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'taxPaidPriorFiscalYear',
    label: 'Taxes Paid Prior Fiscal Year-end',
  },
  netIncomeMostRecentFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'netIncomeMostRecentFiscalYear',
    label: 'Net Income Most Recent Fiscal Year-end',
  },
  netIncomePriorFiscalYear: {
    value: '0.00',
    error: undefined,
    rule: 'required|numeric|max:99999999999999.99|regex:/[\\+\\-]?\\d{0,14}\\.\\d{2}/',
    key: 'netIncomePriorFiscalYear',
    label: 'Net Income Prior Fiscal Year-end',
  },
  issueJurisdictionSecuritiesOffering: {
    value: '',
    error: undefined,
    rule: 'required|max:53',
    key: 'issueJurisdictionSecuritiesOffering',
    label: 'Using the list below, select the jurisdictions in which the issuer intends to offer the securities',
  },
};

export const SIGNATURE = {
  issuer: {
    value: '',
    error: undefined,
    rule: 'required|max:150',
    key: 'issuer',
    label: 'Issuer',
  },
  issuerSignature: {
    value: '',
    error: undefined,
    rule: 'required|max:150',
    key: 'issuerSignature',
    label: 'Signature',
  },
  issuerTitle: {
    value: '',
    error: undefined,
    rule: 'required|max:256',
    key: 'issuerTitle',
    label: 'Title',
  },
  signaturePersons: [PERSONAL_SIGNATURE],
};

export const OFFERED_SECURITIES = [
  { key: 'Common Stock', value: 'Common Stock', text: 'Common Stock' },
  { key: 'Preferred Stock', value: 'Preferred Stock', text: 'Preferred Stock' },
  { key: 'Debt', value: 'Debt', text: 'Debt' },
  { key: 'Other', value: 'Other', text: 'Other' },
];

export const OVER_SUBSCRIPTION_ALLOCATION_TYPES = [
  { key: 'Pro-rata basis', value: 'Pro-rata basis', text: 'Pro-rata basis' },
  {
    key: 'First-come, first-served basis',
    value: 'First-come, first-served basis',
    text: 'First-come, first-served basis',
  },
  { key: 'Other', value: 'Other', text: 'Other' },
];

export const LEGAL_FORM_TYPES = [
  { key: 'Corporation', value: 'Corporation', text: 'Corporation' },
  { key: 'Limited Partnership', value: 'Limited Partnership', text: 'Limited Partnership' },
  {
    key: 'Limited Liability Company',
    value: 'Limited Liability Company',
    text: 'Limited Liability Company',
  },
  { key: 'General Partnership', value: 'General Partnership', text: 'General Partnership' },
  { key: 'Business Trust', value: 'Business Trust', text: 'Business Trust' },
  { key: 'Other', value: 'Other', text: 'Other (Specify)' },
];

export const US_STATES = [
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
  { key: 'RI', value: 'RI', text: 'RHODE ISLAND' },
  { key: 'SC', value: 'SC', text: 'SOUTH CAROLINA' },
  { key: 'SD', value: 'SD', text: 'SOUTH DAKOTA' },
  { key: 'TN', value: 'TN', text: 'TENNESSEE' },
  { key: 'TX', value: 'TX', text: 'TEXAS' },
  { key: 'X1', value: 'X1', text: 'UNITED STATES' },
  { key: 'UT', value: 'UT', text: 'UTAH' },
  { key: 'VT', value: 'VT', text: 'VERMONT' },
  { key: 'VA', value: 'VA', text: 'VIRGINIA' },
  { key: 'WA', value: 'WA', text: 'WASHINGTON' },
  { key: 'WV', value: 'WV', text: 'WEST VIRGINIA' },
  { key: 'WI', value: 'WI', text: 'WISCONSIN' },
  { key: 'WY', value: 'WY', text: 'WYOMING' },
  { key: 'A0', value: 'A0', text: 'ALBERTA, CANADA' },
  { key: 'A1', value: 'A1', text: 'BRITISH COLUMBIA, CANADA' },
  { key: 'A2', value: 'A2', text: 'MANITOBA, CANADA' },
  { key: 'A3', value: 'A3', text: 'NEW BRUNSWICK, CANADA' },
  { key: 'A4', value: 'A4', text: 'NEWFOUNDLAND, CANADA' },
  { key: 'A5', value: 'A5', text: 'NOVA SCOTIA, CANADA' },
  { key: 'A6', value: 'A6', text: 'ONTARIO, CANADA' },
  { key: 'A7', value: 'A7', text: 'PRINCE EDWARD ISLAND, CANADA' },
  { key: 'A8', value: 'A8', text: 'QUEBEC, CANADA' },
  { key: 'A9', value: 'A9', text: 'SASKATCHEWAN, CANADA' },
  { key: 'B0', value: 'B0', text: 'YUKON, CANADA' },
  { key: 'Z4', value: 'Z4', text: 'CANADA (FEDERAL LEVEL)' },
  { key: 'B2', value: 'B2', text: 'AFGHANISTAN' },
  { key: 'Y6', value: 'Y6', text: 'ALAND ISLANDS' },
  { key: 'B3', value: 'B3', text: 'ALBANIA' },
  { key: 'B4', value: 'B4', text: 'ALGERIA' },
  { key: 'B5', value: 'B5', text: 'AMERICAN SAMOA' },
  { key: 'B6', value: 'B6', text: 'ANDORRA' },
  { key: 'B7', value: 'B7', text: 'ANGOLA' },
  { key: '1A', value: '1A', text: 'ANGUILLA' },
  { key: 'B8', value: 'B8', text: 'ANTARCTICA' },
  { key: 'B9', value: 'B9', text: 'ANTIGUA AND BARBUDA' },
  { key: 'C1', value: 'C1', text: 'ARGENTINA' },
  { key: '1B', value: '1B', text: 'ARMENIA' },
  { key: '1C', value: '1C', text: 'ARUBA' },
  { key: 'C3', value: 'C3', text: 'AUSTRALIA' },
  { key: 'C4', value: 'C4', text: 'AUSTRIA' },
  { key: '1D', value: '1D', text: 'AZERBAIJAN' },
  { key: 'C5', value: 'C5', text: 'BAHAMAS' },
  { key: 'C6', value: 'C6', text: 'BAHRAIN' },
  { key: 'C7', value: 'C7', text: 'BANGLADESH' },
  { key: 'C8', value: 'C8', text: 'BARBADOS' },
  { key: '1F', value: '1F', text: 'BELARUS' },
  { key: 'C9', value: 'C9', text: 'BELGIUM' },
  { key: 'D1', value: 'D1', text: 'BELIZE' },
  { key: 'G6', value: 'G6', text: 'BENIN' },
  { key: 'D0', value: 'D0', text: 'BERMUDA' },
  { key: 'D2', value: 'D2', text: 'BHUTAN' },
  { key: 'D3', value: 'D3', text: 'BOLIVIA' },
  { key: '1E', value: '1E', text: 'BOSNIA AND HERZEGOVINA' },
  { key: 'B1', value: 'B1', text: 'BOTSWANA' },
  { key: 'D4', value: 'D4', text: 'BOUVET ISLAND' },
  { key: 'D5', value: 'D5', text: 'BRAZIL' },
  { key: 'D6', value: 'D6', text: 'BRITISH INDIAN OCEAN TERRITORY' },
  { key: 'D9', value: 'D9', text: 'BRUNEI DARUSSALAM' },
  { key: 'E0', value: 'E0', text: 'BULGARIA' },
  { key: 'X2', value: 'X2', text: 'BURKINA FASO' },
  { key: 'E2', value: 'E2', text: 'BURUNDI' },
  { key: 'E3', value: 'E3', text: 'CAMBODIA' },
  { key: 'E4', value: 'E4', text: 'CAMEROON' },
  { key: 'E8', value: 'E8', text: 'CAPE VERDE' },
  { key: 'E9', value: 'E9', text: 'CAYMAN ISLANDS' },
  { key: 'F0', value: 'F0', text: 'CENTRAL AFRICAN REPUBLIC' },
  { key: 'F2', value: 'F2', text: 'CHAD' },
  { key: 'F3', value: 'F3', text: 'CHILE' },
  { key: 'F4', value: 'F4', text: 'CHINA' },
  { key: 'F6', value: 'F6', text: 'CHRISTMAS ISLAND' },
  { key: 'F7', value: 'F7', text: 'COCOS (KEELING) ISLANDS' },
  { key: 'F8', value: 'F8', text: 'COLOMBIA' },
  { key: 'F9', value: 'F9', text: 'COMOROS' },
  { key: 'G0', value: 'G0', text: 'CONGO' },
  { key: 'Y3', value: 'Y3', text: 'CONGO, THE DEMOCRATIC REPUBLIC OF THE' },
  { key: 'G1', value: 'G1', text: 'COOK ISLANDS' },
  { key: 'G2', value: 'G2', text: 'COSTA RICA' },
  { key: 'L7', value: 'L7', text: 'COTE D\'IVOIRE' },
  { key: '1M', value: '1M', text: 'CROATIA' },
  { key: 'G3', value: 'G3', text: 'CUBA' },
  { key: 'G4', value: 'G4', text: 'CYPRUS' },
  { key: '2N', value: '2N', text: 'CZECH REPUBLIC' },
  { key: 'G7', value: 'G7', text: 'DENMARK' },
  { key: '1G', value: '1G', text: 'DJIBOUTI' },
  { key: 'G9', value: 'G9', text: 'DOMINICA' },
  { key: 'G8', value: 'G8', text: 'DOMINICAN REPUBLIC' },
  { key: 'H1', value: 'H1', text: 'ECUADOR' },
  { key: 'H2', value: 'H2', text: 'EGYPT' },
  { key: 'H3', value: 'H3', text: 'EL SALVADOR' },
  { key: 'H4', value: 'H4', text: 'EQUATORIAL GUINEA' },
  { key: '1J', value: '1J', text: 'ERITREA' },
  { key: '1H', value: '1H', text: 'ESTONIA' },
  { key: 'H5', value: 'H5', text: 'ETHIOPIA' },
  { key: 'H7', value: 'H7', text: 'FALKLAND ISLANDS (MALVINAS)' },
  { key: 'H6', value: 'H6', text: 'FAROE ISLANDS' },
  { key: 'H8', value: 'H8', text: 'FIJI' },
  { key: 'H9', value: 'H9', text: 'FINLAND' },
  { key: 'I0', value: 'I0', text: 'FRANCE' },
  { key: 'I3', value: 'I3', text: 'FRENCH GUIANA' },
  { key: 'I4', value: 'I4', text: 'FRENCH POLYNESIA' },
  { key: '2C', value: '2C', text: 'FRENCH SOUTHERN TERRITORIES' },
  { key: 'I5', value: 'I5', text: 'GABON' },
  { key: 'I6', value: 'I6', text: 'GAMBIA' },
  { key: '2Q', value: '2Q', text: 'GEORGIA' },
  { key: '2M', value: '2M', text: 'GERMANY' },
  { key: 'J0', value: 'J0', text: 'GHANA' },
  { key: 'J1', value: 'J1', text: 'GIBRALTAR' },
  { key: 'J3', value: 'J3', text: 'GREECE' },
  { key: 'J4', value: 'J4', text: 'GREENLAND' },
  { key: 'J5', value: 'J5', text: 'GRENADA' },
  { key: 'J6', value: 'J6', text: 'GUADELOUPE' },
  { key: 'GU', value: 'GU', text: 'GUAM' },
  { key: 'J8', value: 'J8', text: 'GUATEMALA' },
  { key: 'Y7', value: 'Y7', text: 'GUERNSEY' },
  { key: 'J9', value: 'J9', text: 'GUINEA' },
  { key: 'S0', value: 'S0', text: 'GUINEA-BISSAU' },
  { key: 'K0', value: 'K0', text: 'GUYANA' },
  { key: 'K1', value: 'K1', text: 'HAITI' },
  { key: 'K4', value: 'K4', text: 'HEARD ISLAND AND MCDONALD ISLANDS' },
  { key: 'X4', value: 'X4', text: 'HOLY SEE (VATICAN CITY STATE)' },
  { key: 'K2', value: 'K2', text: 'HONDURAS' },
  { key: 'K3', value: 'K3', text: 'HONG KONG' },
  { key: 'K5', value: 'K5', text: 'HUNGARY' },
  { key: 'K6', value: 'K6', text: 'ICELAND' },
  { key: 'K7', value: 'K7', text: 'INDIA' },
  { key: 'K8', value: 'K8', text: 'INDONESIA' },
  { key: 'K9', value: 'K9', text: 'IRAN, ISLAMIC REPUBLIC OF' },
  { key: 'L0', value: 'L0', text: 'IRAQ' },
  { key: 'L2', value: 'L2', text: 'IRELAND' },
  { key: 'Y8', value: 'Y8', text: 'ISLE OF MAN' },
  { key: 'L3', value: 'L3', text: 'ISRAEL' },
  { key: 'L6', value: 'L6', text: 'ITALY' },
  { key: 'L8', value: 'L8', text: 'JAMAICA' },
  { key: 'M0', value: 'M0', text: 'JAPAN' },
  { key: 'Y9', value: 'Y9', text: 'JERSEY' },
  { key: 'M2', value: 'M2', text: 'JORDAN' },
  { key: '1P', value: '1P', text: 'KAZAKSTAN' },
  { key: 'M3', value: 'M3', text: 'KENYA' },
  { key: 'J2', value: 'J2', text: 'KIRIBATI' },
  { key: 'M4', value: 'M4', text: 'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF' },
  { key: 'M5', value: 'M5', text: 'KOREA, REPUBLIC OF' },
  { key: 'M6', value: 'M6', text: 'KUWAIT' },
  { key: '1N', value: '1N', text: 'KYRGYZSTAN' },
  { key: 'M7', value: 'M7', text: 'LAO PEOPLE\'S DEMOCRATIC REPUBLIC' },
  { key: '1R', value: '1R', text: 'LATVIA' },
  { key: 'M8', value: 'M8', text: 'LEBANON' },
  { key: 'M9', value: 'M9', text: 'LESOTHO' },
  { key: 'N0', value: 'N0', text: 'LIBERIA' },
  { key: 'N1', value: 'N1', text: 'LIBYAN ARAB JAMAHIRIYA' },
  { key: 'N2', value: 'N2', text: 'LIECHTENSTEIN' },
  { key: '1Q', value: '1Q', text: 'LITHUANIA' },
  { key: 'N4', value: 'N4', text: 'LUXEMBOURG' },
  { key: 'N5', value: 'N5', text: 'MACAU' },
  { key: '1U', value: '1U', text: 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF' },
  { key: 'N6', value: 'N6', text: 'MADAGASCAR' },
  { key: 'N7', value: 'N7', text: 'MALAWI' },
  { key: 'N8', value: 'N8', text: 'MALAYSIA' },
  { key: 'N9', value: 'N9', text: 'MALDIVES' },
  { key: 'O0', value: 'O0', text: 'MALI' },
  { key: 'O1', value: 'O1', text: 'MALTA' },
  { key: '1T', value: '1T', text: 'MARSHALL ISLANDS' },
  { key: 'O2', value: 'O2', text: 'MARTINIQUE' },
  { key: 'O3', value: 'O3', text: 'MAURITANIA' },
  { key: 'O4', value: 'O4', text: 'MAURITIUS' },
  { key: '2P', value: '2P', text: 'MAYOTTE' },
  { key: 'O5', value: 'O5', text: 'MEXICO' },
  { key: '1K', value: '1K', text: 'MICRONESIA, FEDERATED STATES OF' },
  { key: '1S', value: '1S', text: 'MOLDOVA, REPUBLIC OF' },
  { key: 'O9', value: 'O9', text: 'MONACO' },
  { key: 'P0', value: 'P0', text: 'MONGOLIA' },
  { key: 'Z5', value: 'Z5', text: 'MONTENEGRO' },
  { key: 'P1', value: 'P1', text: 'MONTSERRAT' },
  { key: 'P2', value: 'P2', text: 'MOROCCO' },
  { key: 'P3', value: 'P3', text: 'MOZAMBIQUE' },
  { key: 'E1', value: 'E1', text: 'MYANMAR' },
  { key: 'T6', value: 'T6', text: 'NAMIBIA' },
  { key: 'P5', value: 'P5', text: 'NAURU' },
  { key: 'P6', value: 'P6', text: 'NEPAL' },
  { key: 'P7', value: 'P7', text: 'NETHERLANDS' },
  { key: 'P8', value: 'P8', text: 'NETHERLANDS ANTILLES' },
  { key: '1W', value: '1W', text: 'NEW CALEDONIA' },
  { key: 'Q2', value: 'Q2', text: 'NEW ZEALAND' },
  { key: 'Q3', value: 'Q3', text: 'NICARAGUA' },
  { key: 'Q4', value: 'Q4', text: 'NIGER' },
  { key: 'Q5', value: 'Q5', text: 'NIGERIA' },
  { key: 'Q6', value: 'Q6', text: 'NIUE' },
  { key: 'Q7', value: 'Q7', text: 'NORFOLK ISLAND' },
  { key: '1V', value: '1V', text: 'NORTHERN MARIANA ISLANDS' },
  { key: 'Q8', value: 'Q8', text: 'NORWAY' },
  { key: 'P4', value: 'P4', text: 'OMAN' },
  { key: 'R0', value: 'R0', text: 'PAKISTAN' },
  { key: '1Y', value: '1Y', text: 'PALAU' },
  { key: '1X', value: '1X', text: 'PALESTINIAN TERRITORY, OCCUPIED' },
  { key: 'R1', value: 'R1', text: 'PANAMA' },
  { key: 'R2', value: 'R2', text: 'PAPUA NEW GUINEA' },
  { key: 'R4', value: 'R4', text: 'PARAGUAY' },
  { key: 'R5', value: 'R5', text: 'PERU' },
  { key: 'R6', value: 'R6', text: 'PHILIPPINES' },
  { key: 'R8', value: 'R8', text: 'PITCAIRN' },
  { key: 'R9', value: 'R9', text: 'POLAND' },
  { key: 'S1', value: 'S1', text: 'PORTUGAL' },
  { key: 'PR', value: 'PR', text: 'PUERTO RICO' },
  { key: 'S3', value: 'S3', text: 'QATAR' },
  { key: 'S4', value: 'S4', text: 'REUNION' },
  { key: 'S5', value: 'S5', text: 'ROMANIA' },
  { key: '1Z', value: '1Z', text: 'RUSSIAN FEDERATION' },
  { key: 'S6', value: 'S6', text: 'RWANDA' },
  { key: 'Z0', value: 'Z0', text: 'SAINT BARTHELEMY' },
  { key: 'U8', value: 'U8', text: 'SAINT HELENA' },
  { key: 'U7', value: 'U7', text: 'SAINT KITTS AND NEVIS' },
  { key: 'U9', value: 'U9', text: 'SAINT LUCIA' },
  { key: 'Z1', value: 'Z1', text: 'SAINT MARTIN' },
  { key: 'V0', value: 'V0', text: 'SAINT PIERRE AND MIQUELON' },
  { key: 'V1', value: 'V1', text: 'SAINT VINCENT AND THE GRENADINES' },
  { key: 'Y0', value: 'Y0', text: 'SAMOA' },
  { key: 'S8', value: 'S8', text: 'SAN MARINO' },
  { key: 'S9', value: 'S9', text: 'SAO TOME AND PRINCIPE' },
  { key: 'T0', value: 'T0', text: 'SAUDI ARABIA' },
  { key: 'T1', value: 'T1', text: 'SENEGAL' },
  { key: 'Z2', value: 'Z2', text: 'SERBIA' },
  { key: 'T2', value: 'T2', text: 'SEYCHELLES' },
  { key: 'T8', value: 'T8', text: 'SIERRA LEONE' },
  { key: 'U0', value: 'U0', text: 'SINGAPORE' },
  { key: '2B', value: '2B', text: 'SLOVAKIA' },
  { key: '2A', value: '2A', text: 'SLOVENIA' },
  { key: 'D7', value: 'D7', text: 'SOLOMON ISLANDS' },
  { key: 'U1', value: 'U1', text: 'SOMALIA' },
  { key: 'T3', value: 'T3', text: 'SOUTH AFRICA' },
  { key: '1L', value: '1L', text: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS' },
  { key: 'U3', value: 'U3', text: 'SPAIN' },
  { key: 'F1', value: 'F1', text: 'SRI LANKA' },
  { key: 'V2', value: 'V2', text: 'SUDAN' },
  { key: 'V3', value: 'V3', text: 'SURINAME' },
  { key: 'L9', value: 'L9', text: 'SVALBARD AND JAN MAYEN' },
  { key: 'V6', value: 'V6', text: 'SWAZILAND' },
  { key: 'V7', value: 'V7', text: 'SWEDEN' },
  { key: 'V8', value: 'V8', text: 'SWITZERLAND' },
  { key: 'V9', value: 'V9', text: 'SYRIAN ARAB REPUBLIC' },
  { key: 'F5', value: 'F5', text: 'TAIWAN, PROVINCE OF CHINA' },
  { key: '2D', value: '2D', text: 'TAJIKISTAN' },
  { key: 'W0', value: 'W0', text: 'TANZANIA, UNITED REPUBLIC OF' },
  { key: 'W1', value: 'W1', text: 'THAILAND' },
  { key: 'Z3', value: 'Z3', text: 'TIMOR-LESTE' },
  { key: 'W2', value: 'W2', text: 'TOGO' },
  { key: 'W3', value: 'W3', text: 'TOKELAU' },
  { key: 'W4', value: 'W4', text: 'TONGA' },
  { key: 'W5', value: 'W5', text: 'TRINIDAD AND TOBAGO' },
  { key: 'W6', value: 'W6', text: 'TUNISIA' },
  { key: 'W8', value: 'W8', text: 'TURKEY' },
  { key: '2E', value: '2E', text: 'TURKMENISTAN' },
  { key: 'W7', value: 'W7', text: 'TURKS AND CAICOS ISLANDS' },
  { key: '2G', value: '2G', text: 'TUVALU' },
  { key: 'W9', value: 'W9', text: 'UGANDA' },
  { key: '2H', value: '2H', text: 'UKRAINE' },
  { key: 'C0', value: 'C0', text: 'UNITED ARAB EMIRATES' },
  { key: 'X0', value: 'X0', text: 'UNITED KINGDOM' },
  { key: '2J', value: '2J', text: 'UNITED STATES MINOR OUTLYING ISLANDS' },
  { key: 'X3', value: 'X3', text: 'URUGUAY' },
  { key: '2K', value: '2K', text: 'UZBEKISTAN' },
  { key: '2L', value: '2L', text: 'VANUATU' },
  { key: 'X5', value: 'X5', text: 'VENEZUELA' },
  { key: 'Q1', value: 'Q1', text: 'VIET NAM' },
  { key: 'D8', value: 'D8', text: 'VIRGIN ISLANDS, BRITISH' },
  { key: 'VI', value: 'VI', text: 'VIRGIN ISLANDS, U.S.' },
  { key: 'X8', value: 'X8', text: 'WALLIS AND FUTUNA' },
  { key: 'U5', value: 'U5', text: 'WESTERN SAHARA' },
  { key: 'T7', value: 'T7', text: 'YEMEN' },
  { key: 'Y4', value: 'Y4', text: 'ZAMBIA' },
  { key: 'Y5', value: 'Y5', text: 'ZIMBABWE' },
  { key: 'XX', value: 'XX', text: 'UNKNOWN' },
];

export const NEW_OFFERING_INFORMATION = {
  businessName: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'businessName',
    label: 'Business Name',
  },
  businessDescription: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'businessDescription',
    label: 'Description',
  },
};

export const XML_STATUSES = {
  created: 'CREATED',
  completed: 'COMPLETED',
  errored: null,
};

export const EDGAR_URL = '/edgar/publish';

export const XML_URL = '/edgar/primary-data';

export const GRAPHQL = '/graphql';
