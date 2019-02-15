export const FILTER_META = {
  method: {
    value: [],
    values: [
      { text: 'All', value: 'ALL' },
      { text: 'Verifier', value: 'VERIFIER' },
      { text: 'Upload', value: 'UPLOAD' },
    ],
    error: undefined,
    rule: 'empty',
  },
  status: {
    value: [],
    values: [
      { text: 'Requested', value: 'REQUESTED' },
      { text: 'Approved', value: 'CONFIRMED' },
      { text: 'Declined', value: 'INVALID' },
    ],
    error: undefined,
    rule: 'empty',
  },
  type: {
    value: [],
    values: [
      { text: 'All', value: 'ALL' },
      { text: 'Asset', value: 'ASSETS' },
      { text: 'Income', value: 'INCOME' },
      { text: 'Trust Assets', value: 'REVOCABLE_TRUST_ASSETS' },
      { text: 'Trust Income', value: 'REVOCABLE_TRUST_INCOME' },
      { text: 'Owners Accredited', value: 'OWNERS_ACCREDITATED' },
      { text: 'Owners Qualified', value: 'OWNERS_QUALIFIED' },
    ],
    error: undefined,
    rule: 'empty',
  },
};

export const CONFIRM_ACCREDITATION = {
  justifyDescription: {
    value: '',
    label: 'Justify your decision',
    error: undefined,
    rule: 'required',
    placeHolder: 'Type your comment here...',
  },
  expiration: {
    value: '12/31/2019',
    label: 'Expiration Date',
    placeHolder: 'Enter here',
    error: undefined,
    rule: 'required|date',
    customErrors: {
      date: 'Date format is invalid.',
    },
  },
};

