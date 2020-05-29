import { FormHelper } from '../../../helper';

export const common = {
  userId: {
    value: '',
    label: 'User ID',
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
      { label: 'Skip full account validation', value: 'skipFullAccountValidation' },
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
    fieldType: 'integer',
    placeHolder: 'Enter here',
  },
};

export const ENCRYPTDECRYPTUTILITY_META = {
  userId: { ...common.userId },
  text: { ...common.text },
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

export const REQUESTFACTORY_LOG__META = FormHelper.generateMeta([
  ['plugin', 'Plugin', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
  ['status', 'Status', '', '', '',
    {
      asIn: true,
      props: {
        values: [
          { key: 'PROCESSING', text: 'PROCESSING', value: 'PROCESSING' },
          { key: 'FAILED', text: 'FAILED', value: 'FAILED' },
          { key: 'SUCCESS', text: 'SUCCESS', value: 'SUCCESS' },
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

const operators = ['=', '!=', '>', '<', '>=', '<=', 'IS', 'IS NOT', 'IN', 'LIKE'].map(o => ({ key: o, value: o, text: o }));

export const QUERY_BUILDER = {
  ...FormHelper.generateMeta([
    ['selectColumns', 'Columns To Retrieve', [], 'required', '',
      {
        asIn: true,
        props: {
          values: [],
        },
      },
    ],
    ['table', 'Table', '', 'required', '',
      {
        asIn: true,
        props: {
          values: [],
        },
      },
    ],
    ['groupByColumns', 'Group By', [], 'optional', '',
      {
        asIn: true,
        props: {
          values: [],
        },
      },
    ],
  ]),
  where: [FormHelper.generateMeta([
    ['name', 'Column', '', 'optional', '', {
      asIn: true,
      props: {
        values: [],
      },
    }],
    ['operator', 'Operator', '', 'optional', '', { asIn: true, props: { values: operators, options: operators } }],
    ['value', 'Value', null, 'optional', ''],
  ])],
  orderBy: [{
    ...FormHelper.generateMeta([
      ['column', 'Column', '', 'optional', '',
        {
          asIn: true,
          props: {
            values: [],
          },
        },
      ],
    ]),
    ...FormHelper.generateMeta([
      ['order', 'Order', '', 'optional', '',
        {
          asIn: true,
          props: {
            values: ['ASC', 'DESC'].map(o => ({ key: o, value: o, text: o })),
          },
        },
      ],
    ]),
  }],
};

export const PROCESSFACTORY_LOG__META = FormHelper.generateMeta([
  ['plugin', 'Plugin', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
  ['status', 'Status', '', '', '',
    {
      asIn: true,
      props: {
        values: [
          { key: 'PROCESSING', text: 'PROCESSING', value: 'PROCESSING' },
          { key: 'FAILED', text: 'FAILED', value: 'FAILED' },
          { key: 'SUCCESS', text: 'SUCCESS', value: 'SUCCESS' },
          { key: 'STARTED', text: 'STARTED', value: 'STARTED' },
        ],
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
  ['emailType', 'Email Type', '', 'required', ''],
]);

export const FILEFACTORY_META = FormHelper.generateMeta([
  ['method', 'Method', '', 'required', '',
    {
      asIn: true,
      props: {
        values: [],
      },
    },
  ],
]);
