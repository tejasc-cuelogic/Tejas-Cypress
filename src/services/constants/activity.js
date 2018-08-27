export const LOG_ACTIVITY = {
  comment: {
    value: '',
    placeHolder: 'Enter comment here...',
    label: '',
    error: undefined,
    rule: 'required|max:256',
    customErrors: {
      required: 'This field is required',
      max: 'This is too long. Max length is :max.',
    },
  },
};
