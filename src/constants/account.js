import moment from 'moment';

export const PLAID_URL = process.env.REACT_APP_PLAID_URL;

export const PLAID_PUBLIC_KEY = process.env.REACT_APP_PLAID_PUBLIC_KEY;

export const INVESTMENT_ACCOUNT_TYPES = {
  0: 'individual',
  1: 'ira',
  2: 'entity',
};

export const FUNDING_OPTIONS = {
  0: 'Check',
  1: 'IRA Transfer',
  2: 'Direct Rollover',
};

export const IRA_ACCOUNT_TYPES = {
  0: 'Traditional',
  1: 'Roth',
};

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

export const INDIVIDUAL_ACCOUNT_CREATION = {
  bankRoutingNumber: {
    value: '',
    key: 'bankRoutingNumber',
    error: undefined,
    rule: 'required|numeric|digits:10',
    label: 'Enter your bank routing number',
  },
  bankAccountNumber: {
    value: '',
    key: 'bankAccountNumber',
    error: undefined,
    rule: 'required|numeric|digits:12',
    label: 'Enter your bank account number',
  },
};

export const IRA_ACCOUNT_CREATION = {
  networth: {
    value: '',
    key: 'networth',
    error: undefined,
    rule: 'required|numeric',
    label: 'Your networth',
    placeHolder: 'Your networth',
  },
  annualIncome: {
    value: '',
    key: 'annualIncome',
    error: undefined,
    rule: 'required|numeric',
    label: 'Your annual income',
    placeHolder: 'Your annual income',
  },
  accountType: {
    value: {
      activeIndex: 0,
      type: IRA_ACCOUNT_TYPES[0],
    },
    key: 'accountType',
    error: undefined,
    rule: 'required|string',
    label: 'Choose an account type',
  },
  fundingOption: {
    value: {
      activeIndex: 0,
      type: FUNDING_OPTIONS[0],
    },
    key: 'accountType',
    error: undefined,
    rule: 'required|string',
    label: 'Choose funding option',
  },
  driversLicence: {
    value: '',
    key: 'driversLicence',
    error: undefined,
    rule: 'required',
    label: '',
  },
};

export const IND_LINK_ACC_MANUALLY = {
  bankRoutingNumber: {
    value: '',
    key: 'bankRoutingNumber',
    error: undefined,
    rule: 'required|numeric|digits:10',
    label: 'Enter your bank routing number',
  },
  bankAccountNumber: {
    value: '',
    key: 'bankAccountNumber',
    error: undefined,
    rule: 'required|numeric|digits:12',
    label: 'Enter your bank account number',
  },
};

export const IND_ADD_FUND = {
  value: {
    value: '',
    key: 'value',
    error: undefined,
    rule: 'required|numeric|digits:10',
    label: 'Value',
  },
};

export const IND_BANK_ACC_SEARCH = {
  bankName: {
    value: '',
    key: 'bankName',
    error: undefined,
    rule: 'required|string',
    label: '',
  },
};

export const IND_BANK_LIST = [
  {
    name: 'BB&T',
    institutionID: 'ins_2',
  },
  {
    name: 'Bank of America',
    institutionID: 'ins_1',
  },
  {
    name: 'Capital One',
    institutionID: 'ins_9',
  },
  {
    name: 'Charles Schwab',
    institutionID: 'ins_11',
  },
  {
    name: 'Chase',
    institutionID: 'ins_3',
  },
  {
    name: 'Citi',
    institutionID: 'ins_5',
  },
  {
    name: 'US Bank',
    institutionID: 'ins_6',
  },
  {
    name: 'USAA',
    institutionID: 'ins_7',
  },
  {
    name: 'Wells Fargo',
    institutionID: 'ins_4',
  },
];

export const IRA_ACC_TYPES = {
  accountType: {
    value: 0,
    values: [
      {
        label: 'Traditional',
        value: 0,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Traditional!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
      },
      {
        label: 'Roth',
        value: 1,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Roth!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const IRA_FUNDING = {
  fundingOption: {
    value: 0,
    values: [
      {
        label: 'Check',
        value: 0,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Check!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
      },
      {
        label: 'IRA Transfer',
        value: 1,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for IRA Transfer!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
      },
      {
        label: 'Direct Rollover',
        value: 2,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit for Direct Rollover!,
        sed do eiusmod tempor incididuntut labore et dolore magna aliqua. Ut enim ad minim veniam`,
      },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const IRA_FIN_INFO = {
  networth: {
    value: '',
    error: undefined,
    rule: 'required|numeric',
    label: 'Your networth',
    placeHolder: 'Your networth',
  },
  annualIncome: {
    value: '',
    error: undefined,
    rule: 'required|numeric',
    label: 'Your annual income',
    placeHolder: 'Your annual income',
  },
};

export const IRA_IDENTITY = {
  driversLicence: {
    value: '',
    key: 'driversLicence',
    error: undefined,
    rule: 'required',
    label: '',
  },
};

export const IS_ENTITY_TRUST = {
  0: 'yes',
  1: 'no',
};

export const ENTITY_FIN_INFO = {
  entityNetAssets: {
    value: '',
    label: 'Entity Net Assets',
    error: undefined,
    rule: 'required|numeric',
  },
  cfInvestments: {
    value: '',
    label: 'Other religion CF investments made in prior 12 months',
    error: undefined,
    rule: 'required|numeric',
  },
};

export const ENTITY_GEN_INFO = {
  nameOfEntity: {
    value: '', label: 'Name of Entity', error: undefined, rule: 'required', placeHolder: 'e.g. Pad Wealth',
  },
  taxId: {
    value: '', label: 'Tax ID', error: undefined, rule: 'required', placeHolder: 'e.g. 12345',
  },
  street: {
    value: '', label: 'Street', error: undefined, rule: 'required|string',
  },
  city: {
    value: '', label: 'City', error: undefined, rule: 'required|string',
  },
  state: {
    value: '', label: 'State', error: undefined, rule: 'required|string',
  },
  zipCode: {
    value: '', label: 'ZIP Code', error: undefined, rule: 'required|numeric',
  },
};

export const ENTITY_TRUST_INFO = {
  isEntityTrust: {
    value: 'yes',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    error: undefined,
    rule: 'required',
  },
  dateOfTrust: {
    value: moment(), error: undefined, rule: 'required', label: 'Date of Trust',
  },
};

export const ENTITY_PERSONAL_INFO = {
  entityTitle: {
    value: '', error: undefined, rule: 'required', label: 'What is your title with the Entity', placeHolder: 'e.g. CEO',
  },
  photoId: {
    value: '', error: undefined, rule: 'required', label: 'Upload a Photo ID', sublabel: 'Drivers License or Passport',
  },
};

export const ENTITY_FORMATION_DOCS = {
  entityFormationDocument: {
    value: '', error: undefined, rule: 'required', label: 'Entity Formation Document',
  },
  entityOperatingDocument: {
    value: '', error: undefined, rule: 'required', label: 'Entity Operating Document',
  },
  einVerification: {
    value: '', error: undefined, rule: 'required', label: 'EIN Verification',
  },
};

export const ENTITY_ACCOUNT_CREATION = {
  entityNetAssets: {
    value: '',
    key: 'entityNetAssets',
    error: undefined,
    rule: 'required|numeric',
    label: 'Entity Net Assets',
  },
  cfInvestments: {
    value: '',
    key: 'cfInvestments',
    error: undefined,
    rule: 'required|numeric',
    label: 'Other religion CF investments made in prior 12 months',
  },
  nameOfEntity: {
    value: '',
    key: 'nameOfEntity',
    error: undefined,
    rule: 'required|string',
    label: 'Name of Entity',
    placeHolder: 'e.g Pad Wealth',
  },
  taxId: {
    value: '',
    key: 'taxId',
    error: undefined,
    rule: 'required|string',
    label: 'Tax ID',
    placeHolder: '12345',
  },
  street: {
    value: '',
    key: 'street',
    error: undefined,
    rule: 'required|string',
    label: 'Street',
  },
  city: {
    value: '',
    key: 'city',
    error: undefined,
    rule: 'required|string',
    label: 'City',
  },
  state: {
    value: '',
    key: 'state',
    error: undefined,
    rule: 'required|string',
    label: 'State',
  },
  zipCode: {
    value: '',
    key: 'zipCode',
    error: undefined,
    rule: 'required|numeric',
    label: 'ZIP Code',
  },
  isEntityTrust: {
    value: 'yes',
    key: 'isEntityTrust',
    error: undefined,
    rule: 'required',
    label: '',
  },
  dateOfTrust: {
    value: moment(),
    key: 'dateOfTrust',
    error: undefined,
    rule: 'required',
    label: 'Date of Trust',
  },
  entityTitle: {
    value: '',
    key: 'entityTitle',
    error: undefined,
    rule: 'required',
    label: 'What is your title with the Entity',
    placeHolder: 'e.g. CEO',
  },
  photoId: {
    value: '',
    key: 'photoId',
    error: undefined,
    rule: '',
    label: '',
  },
  entityFormationDocument: {
    value: '',
    key: 'entityFormationDocument',
    error: undefined,
    rule: '',
    label: 'Entity Formation Document',
  },
  entityOperatingDocument: {
    value: '',
    key: 'entityOperatingDocument',
    error: undefined,
    rule: '',
    label: 'Entity Operating Document',
  },
  einVerification: {
    value: '',
    key: 'einVerification',
    error: undefined,
    rule: '',
    label: 'EIN Verification',
  },
};

