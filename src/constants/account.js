import moment from 'moment';

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

export const INDIVIDUAL_ACCOUNT_CREATION = {
  bankRoutingNumber: {
    value: '',
    key: 'bankRoutingNumber',
    error: undefined,
    rule: 'required|numeric|digits:10',
    label: 'Enter your bank routing number',
    placeHolder: '',
  },
  bankAccountNumber: {
    value: '',
    key: 'bankAccountNumber',
    error: undefined,
    rule: 'required|numeric|digits:12',
    label: 'Enter your bank account number',
    placeHolder: '',
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
    placeHolder: '',
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
    placeHolder: '',
  },
  driversLicence: {
    value: '',
    key: 'driversLicence',
    error: undefined,
    rule: 'required',
    label: '',
    placeHolder: '',
  },
};

export const IS_ENTITY_TRUST = {
  0: 'yes',
  1: 'no',
};

export const ENTITY_ACCOUNT_CREATION = {
  entityNetAssets: {
    value: '',
    key: 'entityNetAssets',
    error: undefined,
    rule: 'required|numeric',
    label: 'Entity Net Assets',
    placeHolder: '',
  },
  cfInvestments: {
    value: '',
    key: 'cfInvestments',
    error: undefined,
    rule: 'required|numeric',
    label: 'Other religion CF investments made in prior 12 months',
    placeHolder: '',
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
    placeHolder: '',
  },
  city: {
    value: '',
    key: 'city',
    error: undefined,
    rule: 'required|string',
    label: 'City',
    placeHolder: '',
  },
  state: {
    value: '',
    key: 'state',
    error: undefined,
    rule: 'required|string',
    label: 'State',
    placeHolder: '',
  },
  zipCode: {
    value: '',
    key: 'zipCode',
    error: undefined,
    rule: 'required|numeric',
    label: 'ZIP Code',
    placeHolder: '',
  },
  isEntityTrust: {
    value: 'yes',
    key: 'isEntityTrust',
    error: undefined,
    rule: 'required',
    label: '',
    placeHolder: '',
  },
  dateOfTrust: {
    value: moment(),
    key: 'dateOfTrust',
    error: undefined,
    rule: 'required',
    label: 'Date of Trust',
    placeHolder: '',
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
    placeHolder: '',
  },
  entityFormationDocument: {
    value: '',
    key: 'entityFormationDocument',
    error: undefined,
    rule: '',
    label: 'Entity Formation Document',
    placeHolder: '',
  },
  entityOperatingDocument: {
    value: '',
    key: 'entityOperatingDocument',
    error: undefined,
    rule: '',
    label: 'Entity Operating Document',
    placeHolder: '',
  },
  einVerification: {
    value: '',
    key: 'einVerification',
    error: undefined,
    rule: '',
    label: 'EIN Verification',
    placeHolder: '',
  },
};
