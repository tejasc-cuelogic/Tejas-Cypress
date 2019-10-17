import { FormHelper } from '../../../helper';

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

export const REQUESTFACTORY_META = FormHelper.generateMeta([
  ['plugin', 'Plugin', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
  ['invocationType', 'Invocation Type', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [
          { key: 'Event', text: 'Event', value: 'Event' },
          { key: 'RequestResponse', text: 'RequestResponse', value: 'RequestResponse' },
        ],
      },
    },
  ],
]);

export const PROCESSFACTORY_META = FormHelper.generateMeta([
  ['method', 'Method', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
]);

export const CRONFACTORY_META = FormHelper.generateMeta([
  ['cron', 'Cron', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
  ['cronMetaType', 'Cron Meta Type', '', '', '',
    {
      asIn: true,
      props: {
        values: [
          { key: 'PLUGIN', text: 'PLUGIN', value: 'PLUGIN' },
          { key: 'LOG', text: 'LOG', value: 'LOG' },
        ],
      },
    },
  ],
  ['jobId', 'Job Id', '', '', 'Enter here'],
]);

export const EMAILLIST_META = FormHelper.generateMeta([
  ['emailType', 'Email Type', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [
          { key: 'DEV', text: 'DEV', value: 'DEV' },
          { key: 'NOTIFICATIONS', text: 'NOTIFICATIONS', value: 'NOTIFICATIONS' },
          { key: 'ACCOUNTS', text: 'ACCOUNTS', value: 'ACCOUNTS' },
          { key: 'ACCREDITATION', text: 'ACCREDITATION', value: 'ACCREDITATION' },
          { key: 'TRANSFERS', text: 'TRANSFERS', value: 'TRANSFERS' },
          { key: 'SALES', text: 'SALES', value: 'SALES' },
          { key: 'APPLY', text: 'APPLY', value: 'APPLY' },
          { key: 'COMMENTS', text: 'COMMENTS', value: 'COMMENTS' },
          { key: 'PAYMENTS', text: 'PAYMENTS', value: 'PAYMENTS' },
          { key: 'SUPPORT_SERVICES', text: 'SUPPORT_SERVICES', value: 'SUPPORT_SERVICES' },
        ],
      },
    },
  ],
]);
