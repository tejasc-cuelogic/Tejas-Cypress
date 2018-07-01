export const LOGIN = {
  email: {
    value: '',
    error: undefined,
    placeHolder: 'E-mail address',
    label: 'E-mail',
    rule: 'required|email',
  },
  password: {
    value: '',
    label: 'Password',
    placeHolder: 'Password',
    rule: 'required|min:8|max:15',
  },
};

export const SIGNUP = {
  givenName: {
    value: '',
    error: undefined,
    rule: 'required',
    label: 'First Name',
    placeHolder: 'First Name',
    customErrors: {
      required: 'The First Name field is required',
    },
  },
  familyName: {
    value: '',
    error: undefined,
    rule: 'required',
    label: 'Last Name',
    placeHolder: 'Last Name',
    customErrors: {
      required: 'The Last Name field is required',
    },
  },
  email: {
    value: '',
    error: undefined,
    placeHolder: 'E-mail address',
    label: 'E-mail',
    rule: 'required|email',
  },
  password: {
    value: '',
    error: undefined,
    label: 'Password',
    placeHolder: 'Password',
    rule: 'required|min:8|max:15',
  },
  verify: {
    value: '',
    error: undefined,
    label: 'Verify Password',
    placeHolder: 'Verify Password',
    rule: 'required|same:password',
    key: 'verify',
  },
  role: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'role',
  },
};
