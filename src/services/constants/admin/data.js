
export const STORAGE_DETAILS_SYNC = {
  userId: {
    value: '',
    label: 'User Id',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
};

export const BULK_STORAGE_DETAILS_SYNC = {
  limit: {
    value: '',
    label: 'Number of Users',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
};

export const OFFERING_REPAYMENT_META = {
  audit: {
    value: [],
    values: [
      { label: 'Audit', value: true },
    ],
    error: undefined,
    rule: 'optional',
  },
  offeringId: {
    value: '',
    label: 'Offering ID',
    error: undefined,
    rule: 'required',
    placeHolder: 'Enter here',
    customErrors: {
      required: 'This field is required',
    },
  },
};
