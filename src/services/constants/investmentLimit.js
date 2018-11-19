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

export const ENTITY_TRUST_ACCREDITATION_METHODS_META = [
  {
    header: 'Income',
    value: 'REVOCABLE_TRUST_INCOME',
    desc: 'Income of $200k, or $300k with spouse, in each of past 2 years and expecting same or more this year',
  },
  {
    header: 'Assets',
    value: 'REVOCABLE_TRUST_ASSETS',
    desc: 'Net worth of $1M individually or joint with spouse, excluding your primary residence',
  },
];

export const ENTITY_ACCREDITATION_METHODS_META = [
  {
    value: 'TWENTY_FIVE_MILLION',
    desc: '$25,000,000 in company assets',
  },
  {
    value: 'FIVE_MILLION',
    desc: '$5,000,000 in company assets',
  },
  {
    value: 'OWNERS_ACCREDITATED',
    desc: 'All owners are accredited investors',
  },
  {
    value: 'OWNERS_QUALIFIED',
    desc: 'All equity owners are qualified purchasers',
    tooltip: 'In order to be a qualified purchase you must have over $5 million in investmetns.',
  },
];

export const ENTITY_ACCREDITATION_METHODS = {
  method: {
    value: 'TWENTY_FIVE_MILLION',
    values: [
      { value: 'TWENTY_FIVE_MILLION' },
      { value: 'FIVE_MILLION' },
      { value: 'OWNERS_ACCREDITATED' },
      { value: 'OWNERS_QUALIFIED' },
    ],
    error: undefined,
    rule: 'required',
  },
};

export const ACCREDITATION_METHODS = {
  grantorName: {
    value: '',
    label: 'Grantor Name',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'required.',
    },
  },
  method: {
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

export const ACCREDITATION_METHODS_ENTITY = {
  grantorName: {
    value: '',
    label: 'Grantor Name',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'required.',
    },
  },
  method: {
    value: 'REVOCABLE_TRUST_INCOME',
    values:
      [
        {
          label: 'Income of $200k, or $300k with spouse, in each of past 2 years and expecting same or more this year',
          value: 'REVOCABLE_TRUST_INCOME',
        },
        {
          label: 'Net worth of $1M individually or joint with spouse, excluding your primary residence',
          value: 'REVOCABLE_TRUST_ASSETS',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const INCOME_EVIDENCE_META = [
  {
    header: 'Send verification request to my lawyer, CPA, registered investment adviser or broker dealer',
    value: 'verificationrequest',
    desc: 'They`ll be asked to confirm in writing that they have reviewed and confirmed the evidence of your accredited investor status.',
  },
  {
    header: 'Upload document',
    value: 'uploaddocument',
    desc: 'W2, 1040, or other official IRS or foreign tax authority document containing salary information for the past 2 years; or a letter from your lawyer, CPA, registered investment advisor or broker-dealer.',
  },
];

export const VERIFY_ACC_WITH_META = [
  {
    header: 'Trusts Assets',
    value: 'ASSETS',
    desc: 'My trust is irrevocable and has more than $5,000,000 in assets.',
  },
  {
    header: 'My trust is revocable and I am accredited',
    value: 'REVOCABLE_TRUST_ASSETS',
    desc: 'Grantor must provide evidence of revocability and accreditation.',
  },
];


export const TRUST_ENTITY_ACCREDITATION = {
  method: {
    value: 'ASSETS',
    values:
      [
        {
          label: 'Trusts Assets',
          value: 'ASSETS',
        },
        {
          label: 'My trust is revocable and I am accredited',
          value: 'REVOCABLE_TRUST_ASSETS',
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
    objRef: 'verifier',
  },
  email: {
    value: '',
    error: undefined,
    placeHolder: 'johndoe@contact.com',
    rule: 'required|email',
    label: 'Verifier e-mail address',
    objRefOutput: 'verifier',
    objRef: 'verifier',
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
    objRef: 'assetsUpload',
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
    objRef: 'assetsUpload',
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
    objRef: 'assetsUpload',
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
export const ENTITY_TRUST_NET_WORTH = {
  netWorth: {
    value: 'FIVE_MILLION',
    values:
      [
        {
          label: '$5,000,000',
          value: 'FIVE_MILLION',
        },
        {
          label: '$25,000,000',
          value: 'TWENTY_FIVE_MILLION',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};
