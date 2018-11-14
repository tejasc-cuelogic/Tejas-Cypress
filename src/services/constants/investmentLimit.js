export const INVESTEMENT_LIMIT = {
  annualIncome: {
    value: '',
    label: 'Annual Income',
    error: undefined,
    rule: 'required',
    tooltip: 'Mention your Annual Income here',
    customErrors: {
      required: 'required.',
    },
  },
  netWorth: {
    value: '',
    label: 'Net Worth',
    error: undefined,
    rule: 'required',
    tooltip: 'Mention your Net Worth here',
    customErrors: {
      required: 'required.',
    },
  },
  cfInvestments: {
    value: '',
    label: 'Other Regulation Crowdfunding investments made in prior 12 months',
    error: undefined,
    rule: 'required',
    tooltip: 'Other Crowdfunding investments',
    customErrors: {
      required: 'required.',
    },
  },
  currentLimitIndividualOrIra: {
    value: '',
    label: 'Your current investment limit',
    error: undefined,
    rule: 'optional',
  },
  currentLimitEntity: {
    value: '',
    label: 'Your current investment limit',
    error: undefined,
    rule: 'optional',
  },
};

export const ACCREDITATION_METHODS_META = [
  {
    header: 'Income',
    value: 'income',
    desc: 'Income of $200k, or $300k with spouse, in each of past 2 years and expecting same or more this year',
  },
  {
    header: 'Assets',
    value: 'assets',
    desc: 'Net worth of $1M individually or joint with spouse, excluding your primary residence',
  },
];

export const ENTITY_ACCREDITATION_METHODS_META = [
  {
    value: '25000000CA',
    desc: '$25,000,000 in company assets',
  },
  {
    value: '5000000CA',
    desc: '$5,000,000 in company assets',
  },
  {
    value: 'asInvestor',
    desc: 'All owners are accredited investors',
  },
  {
    value: 'qualPurchase',
    desc: 'All equity owners are qualified purchasers',
  },
];

export const ENTITY_ACCREDITATION_METHODS = {
  accreditationMethods: {
    value: '25000000CA',
    values: [
      { value: '25000000CA' },
      { value: '5000000CA' },
      { value: 'asInvestor' },
      { value: 'qualPurchase' },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const ACCREDITATION_METHODS = {
  accreditationMethods: {
    value: 'income',
    values:
      [
        {
          label: 'have an income of $200,000 or more (or $300,000 or more with my spouse) in each of the past 2 years and am expecting the same or more this year.',
          value: 'income',
        },
        {
          label: 'I have a net worth of $1M or more (individually or with my spouse), exclusing my primary residence.',
          value: 'assets',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const INCOME_EVIDENCE_META = [
  {
    header: 'Send verification request to my lawyer, CPA, investment adviser or broker',
    value: 'verificationrequest',
    desc: 'They’ll be asked to confirm that they have seen evidence of your claimed status. No documentation required',
  },
  {
    header: 'Upload document',
    value: 'uploaddocument',
    desc: 'W2, 1040, other IRS or foregin tax authority document containing salary for the past 2 years (2016 and 2017), or a letter from your lawyer accountatn, investment advisor or investment broker',
  },
];

export const INCOME_EVIDENCE = {
  incEvidenceMethods: {
    value: 'verificationrequest',
    values:
      [
        {
          label: `Send verification request to my lawyer, CPA, investment adviser or broker
          They’ll be asked to confirm that they have seen evidence of your claimed status. No documentation required`,
          value: 'verificationrequest',
        },
        {
          label: 'I have a net worth of $1M or more (individually or with my spouse), exclusing my primary residence.',
          value: 'uploaddocument',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const VERIFICATION_REQUEST = {
  verifierRole: {
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Choose verifier role',
    label: 'Verifier role',
    tooltip: 'Lawyer, CPA, investment advisor or investment broker',
  },
  verifierEmail: {
    value: '',
    error: undefined,
    placeHolder: 'johndoe@contact.com',
    rule: 'required|email',
    label: 'Verifier e-mail address',
  },
};

export const INCOME_UPLOAD_DOCUMENTS = {
  incomeDocSecondLastYear: {
    label: '2016 Income Documentation',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
  incomeDocLastYear: {
    label: '2017 Income Documentation',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

export const ASSETS_UPLOAD_DOCUMENTS = {
  statementDoc: {
    label: '',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

export const NET_WORTH = {
  netWorth: {
    value: '$1,000,000',
    values:
      [
        {
          label: '$5,000,000',
          value: '$5,000,000',
        },
        {
          label: '$2,100,000',
          value: '$2,100,000',
        },
        {
          label: '$1,000,000',
          value: '$1,000,000',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};
