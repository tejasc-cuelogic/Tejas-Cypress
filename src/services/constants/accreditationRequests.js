export const FILTER_META = {
  method: {
    value: [],
    values: [
      { text: 'Select Method', key: '', value: '' },
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
      { text: 'Select Status', key: '', value: '' },
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
      { text: 'Select Type', key: '', value: '' },
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
  declinedMessage: {
    value: '',
    label: 'Message for User on UI',
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
  justificationDocuemnts: {
    value: '',
    label: 'Justification Documents',
    error: undefined,
    rule: 'optional',
    showLoader: false,
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

