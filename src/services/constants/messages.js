export const DRAFT_NEW = {
  comment: {
    value: '',
    placeHolder: 'Write a new message',
    label: '',
    error: undefined,
    rule: 'max:1400',
    customErrors: {
      // required: 'This field is required',
      max: 'This is too long. Max length is :max.',
    },
  },
};
