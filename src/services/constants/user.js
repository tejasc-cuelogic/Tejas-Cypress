export const securitySections = [
  {
    title: 'Password',
    description: `Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.
    Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.`,
    action: ['change-password', 'Change Password'],
  },
  {
    title: 'Multi-Factor Autentitaction',
    description: `Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.
    Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.`,
    action: ['mfa', 'Manage multi-factor autentication'],
  },
  {
    title: 'Social Connect',
    description: `Your NextSeed account is not connected to any social media.
    If you wish to connect it now, click one of the button below.`,
    action: ['social-connect'],
  },
];

export const USER_IDENTITY = {
  title: {
    value: '',
    label: 'Title',
    error: undefined,
    rule: 'string',
  },
  firstLegalName: {
    value: '',
    label: 'First Name (Legal)',
    error: undefined,
    rule: 'required',
  },
  lastLegalName: {
    value: '',
    label: 'Last Name (Legal)',
    error: undefined,
    rule: 'required',
  },
  residentalStreet: {
    value: '',
    label: 'Residential Address',
    error: undefined,
    rule: 'required',
  },
  city: {
    value: '',
    label: 'City',
    error: undefined,
    rule: 'required',
  },
  state: {
    value: '',
    label: 'State',
    error: undefined,
    rule: 'required',
  },
  zipCode: {
    value: '',
    label: 'Zip Code',
    error: undefined,
    rule: 'required',
  },
  phoneNumber: {
    value: '',
    label: 'Phone Number',
    error: undefined,
    rule: 'required|maskedPhoneNumber',
  },
  dateOfBirth: {
    value: '',
    label: 'Date of Birth',
    error: undefined,
    rule: 'required',
  },
  ssn: {
    value: '',
    label: 'Social Security Number',
    error: undefined,
    rule: 'required|maskedSSN',
  },
};

export const USER_TITLE = [
  { key: 'Mr', value: 'Mr', text: 'Mr' },
  { key: 'Ms', value: 'Ms', text: 'Ms' },
  { key: 'Mrs', value: 'Mrs', text: 'Mrs' },
];
