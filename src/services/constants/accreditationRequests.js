export const FILTER_META = {
  method: {
    value: [],
    values: [
      { text: 'All', value: 'all' },
      { text: 'Verifier', value: 'verifier' },
      { text: 'Upload', value: 'upload' },
    ],
    error: undefined,
    rule: 'empty',
  },
  type: {
    value: [],
    values: [
      { text: 'All', value: 'all' },
      { text: 'Asset', value: 'asset' },
      { text: 'Income', value: 'income' },
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
};

