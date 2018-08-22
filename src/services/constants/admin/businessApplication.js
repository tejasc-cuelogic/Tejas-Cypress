export const OVERVIEW = {
  data: [{
    criticalPoint: {
      value: '',
      label: 'Critical Point',
      error: undefined,
      rule: 'string',
      placeHolder: 'Enter here...',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
  }],
};

export const MANAGERS = {
  managerOverview: {
    value: '',
    label: 'Manager Overview',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
};

export const JUSTIFICATIONS = {
  data: [{
    justification: {
      value: '',
      label: 'Justification',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here...',
      customErrors: {
        required: '* required.',
      },
    },
  }],
};

export const DOCUMENTATION = {
  taxReturnsForControlOwners: {
    value: '',
    label: 'Do the Tax Returns for Control Owners Reveal Any Negative Information?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  taxReturnsForBusinessMatch: {
    value: '',
    label: 'Do the Tax Returns for Business Match Historical Financials?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  backupProofOfIncomeAndAssets: {
    value: '',
    label: 'If Providing PG, Does It Generally Back up Proof of Income and Certain Assets?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  hasBusinessProfitable: {
    value: '',
    label: 'Has the Business Been Profitable and Meet Our Margin Requirements?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  anyQuestionableItems: {
    value: '',
    label: 'Are There Any Questionable Items on the Balance Sheet or Other Statements?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  anyNegativeTrends: {
    value: '',
    label: 'Are There Any Negative Trends?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  anyCushionForIncidentals: {
    value: '',
    label: 'Have the Balances Been Relatively Consistent and is There Any Cushion for Incidentals?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  anyUnusualMovements: {
    value: '',
    label: 'Are there any unusual movements or one-off large deposits/withdrawals that warrant an explanation?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  leaseOrMortgage: {
    value: '',
    label: 'LOI/Lease or Mortgage',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
};

export const PROJECTIONS = {
  compareHistoricalForReasonabless: {
    value: '',
    label: 'If Existing Business, Compare Historical for Reasonabless',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  areTheProjectionsComplete: {
    value: '',
    label: 'Are the Projections Complete (length of time, standard line items, etc.)?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  revenueCheck: {
    value: '',
    label: 'Revenue Check (Calculations)',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  revenueCheckUpload: {
    label: '',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
  majorLineItems: {
    value: '',
    label: 'Opex Major Line Litems (e.g. Rent, Salaries)',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  tiesToLeaseAgreement: {
    value: '',
    label: 'Rent/NNN Ties to Lease Agreement',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  benchmarkAndPrintComps: {
    value: '',
    label: 'Benchmark and Print Comps',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  benchmarkUpload: {
    label: '',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
  requirements: {
    value: '',
    label: 'Existing Debt/Equity Terms and Other Cash Flow Requirements',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
};

export const BUSINESS_PLAN = {
  locationFeasibility: {
    value: '',
    label: 'Location feasibility',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  timingOfOperations: {
    value: '',
    label: 'Timing of Operations',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  writeupTieToProjections: {
    value: '',
    label: 'Does the Financial Write-up Tie to Projections?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  isPlanAdequate: {
    value: '',
    label: 'Is the Operations/Marketing Plan Adequate?',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
  dateOfIncorporation: {
    value: '',
    label: 'Date of Incorporation',
    placeHolder: 'mm-dd-yyyy',
    error: undefined,
    rule: 'required|date',
  },
};

export const CONTROL_PERSONS = {
  data: [{
    name: {
      value: '',
      label: 'Name',
      error: undefined,
      rule: 'required|string',
      placeHolder: 'John Doe',
      customErrors: {
        required: '* required.',
        string: 'Allowed string only.',
      },
    },
    ownership: {
      value: '',
      label: 'Ownership %',
      error: undefined,
      rule: 'required',
      placeHolder: '10.0%',
      customErrors: {
        required: '* required.',
      },
    },
    derogatoryMarks: {
      value: '',
      label: 'Derogatory Marks',
      error: undefined,
      rule: 'required',
      placeHolder: 'Enter here',
      customErrors: {
        required: '* required.',
      },
    },
    experience: {
      value: '',
      label: 'Experience',
      error: undefined,
      rule: 'required',
      placeHolder: 'Experience Comment',
      customErrors: {
        required: '* required.',
      },
    },
    creditScore: {
      value: '',
      label: 'Credit Score',
      error: undefined,
      rule: 'required',
      placeHolder: 'Credit Score Comment',
      customErrors: {
        required: '* required.',
      },
    },
    experienceFile: {
      label: '',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
      customErrors: {
        required: '* required.',
      },
    },
    creditScoreFile: {
      label: '',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
      customErrors: {
        required: '* required.',
      },
    },
  }],
};

export const SOURCES = {
  data: [{
    name: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      customErrors: {
        string: 'Allowed string only.',
      },
    },

    amount: {
      value: '',
      label: '',
      error: undefined,
      rule: 'numeric',
      customErrors: {
        numeric: 'Allowed numbers only.',
      },
    },
  }],
};

export const USES = {
  data: [{
    name: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
    amount: {
      value: '',
      label: '',
      error: undefined,
      rule: 'numeric',
      customErrors: {
        numeric: 'Allowed numbers only.',
      },
    },
  }],
};

export const LAUNCH = {
  data: [{
    contingency: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      placeHolder: 'Enter contingency here...',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
    acceptanceCriteria: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      placeHolder: 'Enter acceptance criteria here...',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
  }],
};

export const CLOSE = {
  data: [{
    contingency: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      placeHolder: 'Enter contingency here...',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
    acceptanceCriteria: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string',
      placeHolder: 'Enter acceptance criteria here...',
      customErrors: {
        string: 'Allowed string only.',
      },
    },
  }],
};

export const SOCIAL_MEDIA = {
  data: [{
    label: {
      value: '',
      label: '',
      placeHolder: 'e.g. Facebook',
      error: undefined,
      rule: 'string',
      customErrors: {
        required: '* required.',
      },
    },
    url: {
      value: '',
      label: '',
      placeHolder: 'Enter here...',
      error: undefined,
      rule: 'url',
      customErrors: {
        required: '* required.',
      },
    },
  }],
};

export const SOCIAL_MEDIA_LABELS = [
  { key: 'Facebook', value: 'facebook', text: 'Facebook' },
  { key: 'Twitter', value: 'twitter', text: 'Twitter' },
  { key: 'Instagram', value: 'instagram', text: 'Instagram' },
  { key: 'Linkedin', value: 'linkedin', text: 'linkedin' },
];

export const OTHER_DOCUMENTATION_UPLOADS = {
  data: [{
    label: {
      value: '',
      label: '',
      placeHolder: 'Enter label here',
      error: undefined,
      rule: 'string',
      customErrors: {
        required: '* required.',
      },
    },
    comment: {
      label: '',
      value: '',
      error: undefined,
      rule: 'required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
      customErrors: {
        required: '* required.',
      },
    },
  }],
};
