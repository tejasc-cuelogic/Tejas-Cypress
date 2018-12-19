export const DRAFT_NEW = {
  comment: {
    value: '',
    placeHolder: 'Write a new message',
    label: '',
    error: undefined,
    rule: 'required|max:500',
    customErrors: {
      required: 'This field is required',
      max: 'This is too long. Max length is :max.',
    },
  },
};
