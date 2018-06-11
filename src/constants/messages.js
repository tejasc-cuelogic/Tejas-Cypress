export const MESSAGES = {
  messages: {
    value: '',
    placeHolder: 'Write a new message',
    label: '',
    key: 'messages',
    error: undefined,
    rule: 'required|max:256',
    customErrors: {
      required: 'This field is required',
      max: 'This is too long. Max length is :max.',
    },
  },
};
