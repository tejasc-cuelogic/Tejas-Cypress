export const COMMON = {
  email: {
    value: '',
    error: undefined,
    placeHolder: 'Email',
    label: 'Email Address',
    rule: 'required|email',
    customErrors: {
      required: '* required field.',
    },
  },
  password: {
    value: '',
    label: 'Password',
    placeHolder: 'Type your password',
    rule: 'required|min:8|max:40',
    error: undefined,
    customErrors: {
      required: '* required field.',
    },
  },
  code: {
    value: '',
    error: undefined,
    rule: 'required|min:6',
    key: 'code',
    label: 'Enter verification code here:',
    customErrors: {
      required: '* required field.',
    },
  },
  verify: {
    value: '',
    error: undefined,
    label: 'Verify Password',
    placeHolder: 'Verify Password',
    rule: 'required|same:password',
    key: 'verify',
    customErrors: {
      required: '* required field.',
      same: 'The Password and Verify Password fields must match.',
    },
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
  givenName: {
    value: '',
    error: undefined,
    rule: 'optional',
    label: 'First Name',
    placeHolder: 'First Name',
    customErrors: {
      required: '* required field.',
    },
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
      required: '* required field.',
    },
  },
  familyName: {
    value: '',
    error: undefined,
    rule: 'required',
    label: 'Last Name',
    placeHolder: 'Last Name',
    customErrors: {
      required: '* required field.',
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
    rule: 'required|min:8|max:40',
  },
  newPasswd: {
    value: '',
    label: 'New Password',
    rule: 'required|min:8|max:40',
  },
  retypePasswd: {
    value: '',
    label: 'Confirm New Password',
    error: undefined,
    rule: 'required|same:newPasswd',
    customErrors: {
      same: 'The Confirm New Password and New Password fields must match.',
    },
  },
};

export const FORGOT_PASS = {
  email: { ...COMMON.email },
};

export const RESET_PASS = {
  email: { ...COMMON.email },
  password: {
    value: '',
    label: 'New Password',
    placeHolder: 'Type your password',
    rule: 'required|min:8|max:40',
    error: undefined,
    customErrors: {
      required: '* required field.',
    },
  },
  verify: { ...COMMON.verify },
  code: { ...COMMON.code },
};

export const NEWSLETTER = {
  // subscriberName: {
  //   value: '',
  //   error: undefined,
  //   rule: 'optional',
  //   label: 'Name',
  //   placeHolder: 'Name',
  // },
  emailAddress: { ...COMMON.email },
};
