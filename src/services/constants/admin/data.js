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

export const PROCESS_TRANSFER_REQ_META = {
  transferId: {
    key: 'transferId',
    value: '',
    label: 'transferId',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
  },
};

export const ENCRYPTDECRYPTUTILITY_META = {
  userId: { ...common.userId },
  text: { ...common.text },
};
export const AUDITBOXFOLDER_META = {
  waitingTime: {
    key: 'waitingTime',
    value: '',
    label: 'Waiting Time',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  concurrency: {
    key: 'concurrency',
    value: '',
    label: 'Concurrency',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  queueLimit: {
    key: 'queueLimit',
    value: '',
    label: 'Queue Limit',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  jobId: {
    key: 'jobId',
    value: '',
    label: 'Job Id',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  userId: {
    key: 'userId',
    value: '',
    label: 'User Id',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  role: {
    key: 'role',
    value: '',
    values: [
      { key: 'Investor', text: 'Investor', value: 'INVESTOR' },
      { key: 'Issuer', text: 'Issuer', value: 'ISSUER' },
    ],
    label: 'User Role',
    error: undefined,
    rule: 'required',
  },
};

export const IMAGEPROCESSINGREQUES_META = {
  waitingTime: {
    key: 'waitingTime',
    value: '',
    label: 'Waiting Time',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  concurrency: {
    key: 'concurrency',
    value: '',
    label: 'Concurrency',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  queueLimit: {
    key: 'queueLimit',
    value: '',
    label: 'Queue Limit',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  key: {
    key: 'key',
    value: '',
    label: 'Key',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
  folderName: {
    key: 'folderName',
    value: '',
    label: 'Folder Name',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
};

export const REQUESTFACTORY_META = {
  plugin: {
    key: 'plugin',
    value: '',
    values: [],
    label: 'Plugin',
    error: undefined,
    rule: 'required',
  },
  invocationType: {
    key: 'invocationType',
    value: '',
    values: [
      { key: 'Event', text: 'Event', value: 'Event' },
      { key: 'RequestResponse', text: 'RequestResponse', value: 'RequestResponse' },
    ],
    label: 'Invocation Type',
    error: undefined,
    rule: 'required',
  },
};

export const CRONFACTORY_META = {
  cron: {
    key: 'cron',
    value: '',
    values: [],
    label: 'cron',
    error: undefined,
    rule: 'required',
  },
  cronMetaType: {
    key: 'cronMetaType',
    value: '',
    values: [
      { key: 'PLUGIN', text: 'PLUGIN', value: 'PLUGIN' },
      { key: 'LOG', text: 'LOG', value: 'LOG' },
    ],
    label: 'Cron Meta Type',
    error: undefined,
    rule: 'optional',
  },
  jobId: {
    key: 'jobId',
    value: '',
    label: 'Job Id',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Enter here',
  },
};

export const PROCESSFACTORY_META = {
  method: {
    key: 'method',
    value: '',
    values: [],
    label: 'method',
    error: undefined,
    rule: 'required',
  },
  // payload: {
  //   key: 'payload',
  //   value: '',
  //   label: 'Payload',
  //   error: undefined,
  //   rule: 'required',
  //   placeHolder: 'Put your JSON ojbect here...',
  // },
};
