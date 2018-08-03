export const COMMON = {
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
    error: undefined,
  },
  code: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'code',
    label: 'Enter verification code here:',
  },
  verify: {
    value: '',
    error: undefined,
    label: 'Verify Password',
    placeHolder: 'Verify Password',
    rule: 'required|same:password',
    key: 'verify',
  },
};

export const LOGIN = {
  email: { ...COMMON.email },
  password: { ...COMMON.password },
};

export const CONFIRM = {
  email: { ...COMMON.email },
  password: { ...COMMON.password },
  code: { ...COMMON.code },
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
  email: { ...COMMON.email },
  password: { ...COMMON.password },
  verify: { ...COMMON.verify },
  role: {
    value: '',
    error: undefined,
    rule: 'required',
    key: 'role',
  },
};

export const CHANGE_PASS = {
  oldPasswd: {
    value: '',
    error: undefined,
    label: 'Old Password',
    rule: 'required|min:8',
  },
  newPasswd: {
    value: '',
    label: 'New Password',
    rule: 'required|min:8',
  },
  retypePasswd: {
    value: '',
    label: 'Confirm New Password',
    error: undefined,
    rule: 'required|same:newPasswd',
  },
};

export const FORGOT_PASS = {
  email: { ...COMMON.email },
};

export const RESET_PASS = {
  email: { ...COMMON.email },
  password: { ...COMMON.password },
  verify: { ...COMMON.verify },
  code: { ...COMMON.code },
};
