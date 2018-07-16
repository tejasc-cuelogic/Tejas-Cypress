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
    placeHolder: 'Mrs',
    error: undefined,
    rule: 'string',
  },
  firstLegalName: {
    value: '',
    label: 'First Name (Legal)',
    placeHolder: 'John',
    error: undefined,
    rule: 'required',
  },
  lastLegalName: {
    value: '',
    label: 'Last Name (Legal)',
    placeHolder: 'Smith',
    error: undefined,
    rule: 'required',
  },
  residentalStreet: {
    value: '',
    label: 'Residential Address',
    placeHolder: 'Baker Street 221B',
    error: undefined,
    rule: 'required',
  },
  city: {
    value: '',
    label: 'City',
    placeHolder: 'New York',
    error: undefined,
    rule: 'required',
  },
  state: {
    value: '',
    label: 'State',
    placeHolder: 'NY',
    error: undefined,
    rule: 'required',
  },
  zipCode: {
    value: '',
    label: 'Zip Code',
    placeHolder: '10011',
    error: undefined,
    rule: 'required',
  },
  phoneNumber: {
    value: '',
    label: 'Phone Number',
    placeHolder: '123-456-7890',
    error: undefined,
    rule: 'required|maskedPhoneNumber',
  },
  dateOfBirth: {
    value: '',
    label: 'Date of Birth',
    placeHolder: 'Select date',
    error: undefined,
    rule: 'required',
  },
  ssn: {
    value: '',
    label: 'Social Security Number',
    placeHolder: '123-456-7890',
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
