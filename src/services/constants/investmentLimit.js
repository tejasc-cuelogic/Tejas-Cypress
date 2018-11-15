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
    value: 'INCOME',
    desc: 'Income of $200k, or $300k with spouse, in each of past 2 years and expecting same or more this year',
  },
  {
    header: 'Assets',
    value: 'ASSETS',
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
    value: 'INCOME',
    values:
      [
        {
          label: 'have an income of $200,000 or more (or $300,000 or more with my spouse) in each of the past 2 years and am expecting the same or more this year.',
          value: 'INCOME',
        },
        {
          label: 'I have a net worth of $1M or more (individually or with my spouse), exclusing my primary residence.',
          value: 'ASSETS',
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

export const VERIFY_ACC_WITH_META = [
  {
    header: 'Trusts Assets',
    value: 'trustsAssets',
    desc: 'My trust is irrevocable and has more than $5,000,000 in assets.',
  },
  {
    header: 'My trust is revocable and I am accredited',
    value: 'RevocableAndAccredited',
    desc: 'Grantor must provide evidence of revocability and accreditation.',
  },
];


export const TRUST_ENTITY_ACCREDITATION = {
  trustEntityAccMethods: {
    value: 'trustsAssets',
    values:
      [
        {
          label: 'Trusts Assets',
          value: 'trustsAssets',
        },
        {
          label: 'My trust is revocable and I am accredited',
          value: 'RevocableAndAccredited',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

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
  role: {
    value: '',
    error: undefined,
    rule: 'required',
    placeHolder: 'Choose verifier role',
    label: 'Verifier role',
    tooltip: 'Lawyer, CPA, investment advisor or investment broker',
    objRefOutput: 'verifier',
  },
  email: {
    value: '',
    error: undefined,
    placeHolder: 'johndoe@contact.com',
    rule: 'required|email',
    label: 'Verifier e-mail address',
    objRefOutput: 'verifier',
  },
};

export const INCOME_UPLOAD_DOCUMENTS = {
  incomeDocSecondLastYear: {
    label: '2016 Income Documentation',
    value: '',
    error: undefined,
    rule: 'required',
    showLoader: false,
    preSignedUrl: '',
    fileId: '',
    fileData: '',
    customErrors: { required: 'required' },
    // objRef: 'portalAgreementUpload',
    objRefOutput: 'assetsUpload',
    objType: 'FileObjectType',
  },
  incomeDocLastYear: {
    label: '2017 Income Documentation',
    value: '',
    error: undefined,
    rule: 'required',
    showLoader: false,
    preSignedUrl: '',
    fileId: '',
    fileData: '',
    customErrors: { required: 'required' },
    objRefOutput: 'assetsUpload',
    // objRefOutput: 'portalAgreementUpload',
    objType: 'FileObjectType',
  },
};

export const ASSETS_UPLOAD_DOCUMENTS = {
  statementDoc: {
    label: '',
    value: [],
    error: undefined,
    rule: 'required',
    showLoader: false,
    preSignedUrl: [],
    fileId: [],
    fileData: [],
    customErrors: { required: 'required' },
    objRefOutput: 'assetsUpload',
    // objRefOutput: 'portalAgreementUpload',
    objType: 'FileObjectType',
  },
};

export const NET_WORTH = {
  netWorth: {
    value: 'ONE_MILLION',
    values:
      [
        {
          label: '$5,000,000',
          value: 'FIVE_MILLION',
        },
        {
          label: '$2,000,000',
          value: 'TWO_MILLION',
        },
        {
          label: '$1,000,000',
          value: 'ONE_MILLION',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};
