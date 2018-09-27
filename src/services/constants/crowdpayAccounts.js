export const FILTER_META = {
  status: {
    value: [],
    values: [
      { label: 'Basic', value: 'Basic' },
      { label: 'CIP Passed', value: 'CIP Passed' },
      { label: 'Verified Phone', value: 'Verified Phone' },
      { label: 'Full', value: 'Full' },
      { label: 'Verified Email', value: 'Verified Email' },
      { label: 'CIP Failed', value: 'CIP Failed' },
      { label: 'Eligible', value: 'Eligible' },
      { label: 'Declined', value: 'Declined' },
    ],
    error: undefined,
    rule: 'array',
  },
  identityStatus: {
    value: [],
    values: [
      { text: 'To Be reviewed', value: 'To Be reviewed' },
      { text: 'Reviewed', value: 'Reviewed' },
    ],
    error: undefined,
    rule: 'empty',
  },
};
