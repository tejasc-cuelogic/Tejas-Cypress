export const common = {
  userId: {
    value: '',
    label: 'User Id',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
  accountId: {
    value: '',
    label: 'Account ID',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
  text: {
    value: '',
    label: 'Text',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
};
export const STORAGE_DETAILS_SYNC = {
  userId: { ...common.userId },
};

export const ES_AUDIT = {
  random: {
    value: 'RANDOM',
    label: 'Document Id',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
};

export const BULK_STORAGE_DETAILS_SYNC = {
  limit: {
    value: '',
    label: 'Number of Users',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
};

export const OFFERING_REPAYMENT_META = {
  audit: {
    value: [],
    values: [
      { label: 'Audit', value: true },
    ],
    error: undefined,
    rule: 'optional',
  },
  offeringId: {
    value: '',
    label: 'Offering ID',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
};

export const PROCESS_FULL_ACCOUNT_META = {
  userId: { ...common.userId },
  accountId: { ...common.accountId },
  options: {
    value: [],
    values: [
      { label: 'Create GoldStar Contact Account', value: 'createGsContactAccount' },
      { label: 'Create Account Pdf', value: 'createAccountPdf' },
      { label: 'Send CrowdPay Email to Goldstar', value: 'sendCrowdPayEmailToGS' },
      { label: 'Create RS Account', value: 'createRSAccount' },
      { label: 'Create Initial Deposit', value: 'createInitialDeposit' },
      { label: 'Send Email To Investor', value: 'sendEmailToInvestor' },
    ],
    error: undefined,
    rule: 'optional',
  },
};
export const RECREATEGOLDSTAR_META = {
  userId: { ...common.userId },
  accountId: { ...common.accountId },
};

export const ENCRYPTDECRYPTUTILITY_META = {
  userId: { ...common.userId },
  text: { ...common.text },
};
