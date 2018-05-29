export const securitySections = [
  {
    title: 'Password',
    description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.',
    action: ['change-password', 'Change Password'],
  },
  {
    title: 'Multi-Factor Autentitaction',
    description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.',
    action: ['mfa', 'Manage multi-factor autentication'],
  },
  {
    title: 'Challenge Questions',
    description: 'Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.',
    action: ['challenge-question', 'Manage challenge questions'],
  },
  {
    title: 'Social Connect',
    description: `Your NextSeed account is not connected to any social media.
    If you wish to connect it now, click one of the button below.`,
    action: ['social-connect'],
  },
];

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
