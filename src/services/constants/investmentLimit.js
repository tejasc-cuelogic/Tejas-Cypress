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
  otherInvestments: {
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

export const ACCREDITATION_METHODS = {
  accreditationMethods: {
    key: 'accreditationMethods',
    value: 'EMPLOYED',
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
