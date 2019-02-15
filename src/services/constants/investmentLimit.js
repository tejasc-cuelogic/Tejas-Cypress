export const ACCREDITATION_STATUS_LABEL = {
  REQUESTED: 'Requested',
  CONFIRMED: 'Approved',
  INVALID: 'Declined',
};

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

export const INCOME_QUALIFICATION_CHECK_META = [
  {
    value: true,
    desc: 'Yes, I have had an income of $200k+ or $300k+ with my spouse in each of the past 2 years and expect the same or higher this year.',
  },
  {
    value: false,
    desc: 'No, my income does not meet this criteria.',
  },
];

export const ENTITY_ACCREDITATION_METHODS = {
  method: {
    value: '',
    values:
      [
        {
          label: 'Yes, my entity is an accredited investor because (a) it has total assets in excess of $5,000,000 or (b) all equity owners of the entity are accredited investors',
          value: 'ASSETS',
        },
        {
          label: 'No, my entity does not qualify to be an accredited investor.',
          value: 'ZERO',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const INCOME_EVIDENCE_META = [
  {
    header1: 'Send verification request to my personal lawyer, CPA, registered investment adviser or broker dealer',
    header2: 'Send verification request to my lawyer, CPA, registered investment adviser or broker dealer',
    value: 'verificationrequest',
    desc1: 'They`ll be asked to confirm in writing that they have reviewed and confirmed evidence of your accredited investor status.',
    desc2: 'They`ll be asked to confirm in writing that they have reviewed and confirmed evidence of your entity`s accredited investor status',
    desc3: 'They`ll be asked to confirm in writing that they have reviewed and confirmed evidence of your trust`s accredited investor status.',
  },
  {
    header1: 'Upload documentation',
    header2: 'Upload verification letter',
    value: 'uploaddocument',
    desc1: 'Documentation could include tax returns, W-2s, or other official IRS or foreign tax authority documents containing salary information for the past 2 years, or a letter from your personal lawyer, CPA, registered investment advisor or broker-dealer.',
    desc2: 'Documentation could include a signed letter from a professional advisor, personal financial statements, bank statements, brokerage statements that show value of accounts, etc. We may also check your credit to verify any liabilities affecting your net worth. This will not affect your credit score.',
    desc3: 'Upload a signed letter from your lawyer, CPA, registered investment advisor or broker-dealer confirming your entity`s accredited investor status.',
    desc4: 'Upload a signed letter from your lawyer, CPA, registered investment advisor or broker-dealer confirming your trust`s accredited investor status.',
  },
];

export const TRUST_ENTITY_ACCREDITATION = {
  method: {
    value: '',
    values:
      [
        {
          label: 'Yes, my trust qualifies as an accredited investor.',
          value: 'ASSETS',
        },
        {
          label: 'No, my trust does not qualify as an accredited investor.',
          value: 'INCOME',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const INCOME_QAL = {
  method: {
    value: '',
    values:
      [
        {
          label: 'Yes, I have had an income of $200,000 or more (or $300,000 or more with my spouse) in each of the past 2 years and expect the same or higher this year.',
          value: 'INCOME',
        },
        {
          label: 'No, my income does not meet this criteria.',
          value: 'ASSETS',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};
export const FILLING_STATUS = {
  method: {
    value: '',
    values:
      [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    error: undefined,
    rule: 'required',
  },
};
export const NETWORTH_QAL = {
  method: {
    value: '',
    values:
      [
        {
          label: 'Yes, I have a net worth of $1M or more (individually or with my spouse), excluding my primary residence.',
          value: 'ASSETS',
        },
        {
          label: 'No, my net worth does not meet this criteria.',
          value: 'NONETWORTH',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const INCOME_EVIDENCE = {
  incEvidenceMethods: {
    value: '',
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
  isAcceptedForfilling: {
    skipField: true,
    value: [],
    values: [
      {
        label: 'I hereby certify that I have a reasonable expectation that my income will meet or exceed the requirement to be considered an accredited investor in 2019.',
        value: 'ACCEPTED',
      },
    ],
    error: undefined,
    rule: 'required',
  },
  isAcceptedForUnfilling: {
    skipField: true,
    value: [],
    values: [
      {
        label: 'There are not yet tax returns, Form W-2s, or other IRS or foreign tax authority documents that evidence my income for 2018. I hereby certify that my income in 2018 met or exceeded the requirement to be considered an accredited investor, and I have a reasonable expectation that my income will meet or exceed such requirement in 2019. I acknowledge that I must provide appropriate documentation for 2018 once it becomes available.',
        value: 'ACCEPTED',
      },
    ],
    error: undefined,
    rule: 'required',
  },
  incomeDocSecondLastYear: {
    label: '2017 Income Documentation',
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
    label: '2018 Income Documentation',
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
  incomeDocThirdLastYear: {
    label: '2016 Income Documentation',
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
  isAccepted: {
    skipField: true,
    value: [],
    values: [
      {
        label: 'My net worth is greater than $1,000,000, excluding my primary residence, and the documents I have uploaded to verify my status are less than 90 days old.',
        value: 'ACCEPTED',
      },
    ],
    error: undefined,
    rule: 'required',
  },
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
    value: '',
    values:
      [
        {
          label: 'Yes, my entity is an accredited investor because (a) it has total assets in excess of $5,000,000 or (b) all equity owners of the entity are accredited investors',
          value: 'FIVE_MILLION',
        },
        {
          label: 'No, my entity does not qualify to be an accredited investor.',
          value: 'ZERO',
        },
      ],
    error: undefined,
    rule: 'required',
  },
};

export const ACCREDITATION_EXPIRY = {
  financialStatus: {
    value: [],
    values: [
      {
        label: 'I hereby certify that I have a reasonable expectation that my income will meet or exceed the requirement to be considered an accredited investor in 2019.',
        value: 'checked',
      },
    ],
    error: undefined,
    rule: 'required',
  },
};
