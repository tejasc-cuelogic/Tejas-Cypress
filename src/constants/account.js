export const INVESTMENT_ACCOUNT_TYPES = {
  0: 'individual',
  1: 'entity',
  2: 'ira',
};

export const FUNDING_OPTIONS = {
  0: 'check',
  1: 'iratransfer',
  2: 'directrollover',
};

export const IRA_ACCOUNT_TYPES = {
  0: 'traditional',
  1: 'roth',
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
    value: IRA_ACCOUNT_TYPES[0],
    key: 'accountType',
    error: undefined,
    rule: 'required|string',
    label: 'Choose an account type',
    placeHolder: '',
  },
  fundingOption: {
    value: FUNDING_OPTIONS[0],
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
