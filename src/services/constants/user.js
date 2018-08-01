export const securitySections = [
  {
    title: 'Password',
    description: `Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.
    Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.`,
    action: ['change-password', 'Change Password'],
  },
  {
    title: 'Multi-factor autentitaction',
    description: 'You can choose your Active MFA Factor.',
    descriptionNotAvailable: `Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellente sque dui, non felis.
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

export const IDENTITY_DOCUMENTS = {
  photoId: {
    key: 'photoId',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
  proofOfResidence: {
    key: 'proofOfResidence',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
};

export const PHONE_VERIFICATION = {
  code: {
    value: '',
    label: 'Enter your verification code here:',
    error: undefined,
    rule: 'required|numeric',
  },
};

export const TRANSACTION_TYPES = [
  { text: 'Deposit', value: 'Deposit' },
  { text: 'Withdrawal', value: 'Withdrawal' },
  { text: 'Repayment', value: 'Repayment' },
  { text: 'Interest Accured', value: 'Interest Accured' },
  { text: 'Referral Credits', value: 'Referral Credits' },
];
