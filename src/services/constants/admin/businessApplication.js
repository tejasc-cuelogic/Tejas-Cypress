export const MANAGERS = {
  managerOverview: {
    value: '',
    label: 'Manager Overview',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
  },
};

export const OVERVIEW = {
  data: [{
    description: {
      value: '',
      label: 'Critical Point',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Enter here...',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
      objRefOutput: 'criticalPoint',
    },
  }],
};

export const OVERVIEW_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
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

export const JUSTIFICATIONS_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
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

export const DOCUMENTATION_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
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

export const PROJECTIONS_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const CONTROL_PERSONS = {
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
    objType: 'FileObjectType',
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
    objType: 'FileObjectType',
    customErrors: {
      required: '* required.',
    },
  },
};

export const SOURCES = {
  name: {
    value: '',
    label: '',
    error: undefined,
    rule: 'required|string',
    customErrors: {
      string: 'Allowed string only.',
      required: '* required.',
    },
    // objRefOutput: 'test',
  },
  amount: {
    value: '',
    label: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
    // objRefOutput: 'test',
  },
};

export const USES = {
  name: {
    value: '',
    label: '',
    error: undefined,
    rule: 'string|required',
    customErrors: {
      string: 'Allowed string only.',
      required: '* required.',
    },
  },
  amount: {
    value: '',
    label: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
};

export const BUSINESS_PLAN = {
  control_persons: [{ ...CONTROL_PERSONS }],
  locationFeasibility: {
    value: '',
    label: 'Location feasibility',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here...',
    // objRefOutput: 'test',
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
    placeHolder: '12-02-1989',
    error: undefined,
    rule: 'required|date',
  },
  sources: [{ ...SOURCES }],
  uses: [{ ...USES }],
};

export const BUSINESS_PLAN_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const CONTINGENCY_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const MISCELLANEOUS_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const OFFER_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const MODEL_MANAGER = {
  managerOverview: { ...MANAGERS.managerOverview },
};

export const LAUNCH = {
  data: [{
    contingency: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Enter contingency here...',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    acceptanceCriteria: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Enter acceptance criteria here...',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
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
      rule: 'string|required',
      placeHolder: 'Enter contingency here...',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    acceptanceCriteria: {
      value: '',
      label: '',
      error: undefined,
      rule: 'string|required',
      placeHolder: 'Enter acceptance criteria here...',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
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
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    url: {
      value: '',
      label: '',
      placeHolder: 'Enter here...',
      error: undefined,
      rule: 'required',
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
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    comment: {
      label: '',
      value: '',
      error: undefined,
      rule: 'string|required',
      preSignedUrl: '',
      fileId: '',
      fileData: '',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  }],
};

export const UPLOADED_DOCUMENTS = {
  data: [{
    document: {
      fileName: 'Business_Plan.pdf',
      attachedDate: '7/10/2018',
      byUser: 'Brandon Black',
      description: `This was the original business plan given to me by the owner.He will be sending
      an updated one to me next week.  Figured we could use this as reference for now.`,
    },
  }],
};

export const OFFERS = {
  data: [{
    structure: {
      value: '',
      label: 'Structure',
      placeHolder: 'Choose',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    offeringAmount: {
      value: '',
      label: 'Offering Amount ($)',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    maturity: {
      value: '',
      label: 'Maturity (# of Months)',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    interestRate: {
      value: '',
      label: 'Annualized Interest Rate',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    amortizationAmount: {
      value: '',
      label: 'Monthly Amortization Amount',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    personalGuarantee: {
      value: '',
      label: 'Personal Guarantee',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    businessBlanket: {
      value: '',
      label: 'Business Blanket',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expirationDate: {
      value: '',
      label: 'Expiration Date',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'date|required',
      customErrors: {
        date: 'Date format is invalid.',
        required: '* required.',
      },
    },
    multipleOnPrincipalToPay: {
      value: '',
      label: 'Multiple on Principal to Pay',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'string|required_if:data.*.structure,revenueshareingnote',
      customErrors: {
        string: 'Allowed string only.',
        required_if: '* required.',
      },
    },
    totalCapitalReturned: {
      value: '',
      label: 'Total Capital Returned',
      placeHolder: 'Enter here',
      error: undefined,
      rule: 'numeric|required_if:data.*.structure,revenueshareingnote',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required_if: '* required.',
      },
    },
  }],
};

export const STRUCTURE_TYPES = [
  { key: 'termnote', value: 'termnote', text: 'Term Loan' },
  { key: 'revenueshareingnote', value: 'revenueshareingnote', text: 'Revenue Share' },
];

export const PERSONAL_GUARANTEE_TYPES = [
  { key: 'yes', value: 'yes', text: 'Yes' },
  { key: 'no', value: 'no', text: 'No' },
];

export const MODEL_INPUTS = {
  totalFunding: {
    value: '',
    label: 'Total Funding Required for Project',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  loanAmount: {
    value: '',
    label: 'Loan Amount Requested on NS',
    placeHolder: '$652,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  debtServiceOutsideNs: {
    value: '',
    label: 'Debt Service Outside NS (annum)',
    placeHolder: '$0',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  personalCreditScore: {
    value: '',
    label: 'Personal Credit Score',
    placeHolder: '692',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  industryExperience: {
    value: '',
    label: 'Industry Experience (years)',
    placeHolder: '15',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  personalGuarantee: {
    value: '',
    values: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }],
    label: 'Personal Guarantee',
    error: undefined,
    rule: 'required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  companyInceptionDate: {
    value: '',
    label: 'Company Inception Date',
    placeHolder: '1/1/18',
    error: undefined,
    rule: 'required|date',
    customErrors: {
      date: 'Date is in invalid format.',
      required: '* required.',
    },
  },
  grossSales: {
    value: '',
    label: 'Gross Sales',
    placeHolder: '$2,800,452',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  grossProfit: {
    value: '',
    label: 'Gross Profit',
    placeHolder: '$1,968,677',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  totalOperExp: {
    value: '',
    label: 'Total Oper Exp',
    placeHolder: '$1,641,783',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  dda: {
    value: '',
    label: 'DD&A',
    placeHolder: '0',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  interest: {
    value: '',
    label: 'Interest',
    placeHolder: '0',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  tax: {
    value: '',
    label: 'Tax',
    placeHolder: '0',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  y1: {
    value: '',
    label: 'Y1',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  y2: {
    value: '',
    label: 'Y2',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  y3: {
    value: '',
    label: 'Y3',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  y4: {
    value: '',
    label: 'Y4',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  y5: {
    value: '',
    label: 'Y5',
    placeHolder: '$1,250,000',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
};

export const MODEL_VARIABLES = {
  min: {
    value: '',
    label: 'Min',
    placeHolder: '10%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  mid: {
    value: '',
    label: 'Mid',
    placeHolder: '18%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  max: {
    value: '',
    label: 'Max',
    placeHolder: '14%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  threeMonth: {
    value: '',
    label: '3-Month',
    placeHolder: '1.91%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  sixMonth: {
    value: '',
    label: '6-Month',
    placeHolder: '2.10%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  twoYear: {
    value: '',
    label: '2-Year',
    placeHolder: '2.52%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  fiveYear: {
    value: '',
    label: '5-Year',
    placeHolder: '2.80%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  tenYear: {
    value: '',
    label: '10-Year',
    placeHolder: '2.94%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  thirtyYear: {
    value: '',
    label: '30-Year',
    placeHolder: '3.08%',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  ficoB1: {
    value: '640',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ficoB2: {
    value: '669',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ficoB3: {
    value: '739',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ficoB4: {
    value: '800',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  companyAgeB1: {
    value: '1',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  companyAgeB2: {
    value: '3',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  companyAgeB3: {
    value: '5',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  companyAgeB4: {
    value: '10',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  dscrB1: {
    value: '1.0',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  dscrB2: {
    value: '1.1',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  dscrB3: {
    value: '1.2',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  dscrB4: {
    value: '2.0',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  niMarginB1: {
    value: '0.05',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  niMarginB2: {
    value: '0.08',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  niMarginB3: {
    value: '0.12',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  niMarginB4: {
    value: '0.14',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ltvB1: {
    value: '0.80',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ltvB2: {
    value: '0.75',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ltvB3: {
    value: '0.70',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  ltvB4: {
    value: '0.65',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  industryExperienceB1: {
    value: '3',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  industryExperienceB2: {
    value: '5',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  industryExperienceB3: {
    value: '10',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
  industryExperienceB4: {
    value: '15',
    label: '',
    placeHolder: '',
    error: undefined,
    rule: 'numeric|required',
    customErrors: {
      numeric: 'Allowed numbers only.',
      required: '* required.',
    },
  },
};

export const MODEL_RESULTS = {
  data: [{
    term: {
      value: '18',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  {
    term: {
      value: '24',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  {
    term: {
      value: '30',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  {
    term: {
      value: '36',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  {
    term: {
      value: '42',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  {
    term: {
      value: '48',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rate: {
      value: '10.65',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanDscr: {
      value: '2.20',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    termLoanFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
    expectedAmount: {
      value: '6035.56',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rslMultiple: {
      value: '19670',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    rsp: {
      value: '27',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareDscr: {
      value: '0.83',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'numeric|required',
      customErrors: {
        numeric: 'Allowed numbers only.',
        required: '* required.',
      },
    },
    revShareFeasible: {
      value: 'Yes',
      label: '',
      placeHolder: '',
      error: undefined,
      rule: 'string|required',
      customErrors: {
        string: 'Allowed string only.',
        required: '* required.',
      },
    },
  },
  ],
};
