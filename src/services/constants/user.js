import Validator from 'validatorjs';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
Validator.register(
  'maskedSSN', (value, attribute) => {
    return value.toString().length === 9;
  },
  'The :attribute is not in the format XXX-XX-XXXX.',
);

Validator.register(
  'maskedPhoneNumber', (value, attribute) => {
    return value.toString().length === 10;
  },
  'The :attribute is not in the format XXX-XXX-XXXX.',
);

export const securitySections = [
  {
    title: 'Password',
    description: 'Change your NextSeed Password.',
    action: ['change-password', 'Change Password'],
  },
  {
    title: 'Social Connect',
    description: `Your NextSeed account is not connected to any social media.
    If you wish to connect it now, click one of the button below.`,
    action: ['social-connect'],
  },
  {
    title: 'Multi-factor Authentication',
    description: 'You can choose your Active MFA Factor.',
    descriptionNotAvailable: '',
    action: ['mfa', 'Manage multi-factor autentication'],
  },
];

export const USER_IDENTITY = {
  title: {
    key: 'title',
    value: '',
    label: 'Title',
    placeHolder: 'Mrs',
    error: undefined,
    rule: 'string',
    customErrors: {
      required: '* required.',
    },
  },
  firstLegalName: {
    key: 'firstLegalName',
    value: '',
    label: 'First Name (Legal)',
    placeHolder: 'John',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  lastLegalName: {
    key: 'lastLegalName',
    value: '',
    label: 'Last Name (Legal)',
    placeHolder: 'Smith',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  residentalStreet: {
    key: 'residentalStreet',
    value: '',
    label: 'Residential Address',
    placeHolder: 'Street Address, City, State, Zip',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  city: {
    key: 'city',
    value: '',
    label: 'City',
    placeHolder: 'New York',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  state: {
    key: 'state',
    value: '',
    label: 'State',
    placeHolder: 'NY',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  zipCode: {
    key: 'zipCode',
    value: '',
    label: 'Zip Code',
    placeHolder: '10011',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
  },
  phoneNumber: {
    key: 'phoneNumber',
    value: '',
    label: 'Phone Number',
    placeHolder: '123-456-7890',
    error: undefined,
    rule: 'required|maskedPhoneNumber',
    customErrors: {
      required: '* required.',
    },
  },
  dateOfBirth: {
    key: 'dateOfBirth',
    value: '',
    label: 'Date of Birth',
    placeHolder: 'mm/dd/yyyy',
    error: undefined,
    rule: 'required|date',
    customErrors: {
      required: '* required.',
    },
  },
  ssn: {
    key: 'ssn',
    value: '',
    label: 'Social Security Number',
    placeHolder: '123-456-7890',
    error: undefined,
    rule: 'required|maskedSSN',
    customErrors: {
      required: '* required.',
    },
  },
};

export const USER_TITLE = [
  { key: 'Mr', value: 'Mr', text: 'Mr' },
  { key: 'Ms', value: 'Ms', text: 'Ms' },
  { key: 'Mrs', value: 'Mrs', text: 'Mrs' },
];

export const IDENTITY_DOCUMENTS = {
  photoId: {
    label: '',
    key: 'photoId',
    value: '',
    error: undefined,
    rule: 'required',
    preSignedUrl: '',
    fileId: '',
    fileData: '',
  },
  proofOfResidence: {
    label: '',
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
    rule: 'required',
  },
};

export const UPDATE_PROFILE_INFO = {
  firstName: {
    value: '',
    label: 'First name',
    error: undefined,
    rule: 'required',
    placeHolder: 'First name',
  },
  lastName: {
    value: '',
    label: 'Last name',
    error: undefined,
    rule: 'required',
    placeHolder: 'Last name',
  },
  phoneNumber: {
    value: '',
    label: 'Phone Number',
    error: undefined,
    rule: 'string',
    placeHolder: 'Phone Number',
  },
  email: {
    value: '',
    label: 'Email',
    error: undefined,
    rule: 'required|email',
    placeHolder: 'Email',
  },
  street: {
    value: '',
    label: 'Residential Street',
    error: undefined,
    rule: 'required|string',
    placeHolder: 'Residential Street',
  },
  city: {
    value: '',
    label: 'City',
    error: undefined,
    rule: 'required|string',
    placeHolder: 'City',
  },
  state: {
    value: '',
    label: 'State',
    error: undefined,
    rule: 'required|string',
  },
  zipCode: {
    value: '',
    label: 'ZIP Code',
    error: undefined,
    rule: 'required|numeric',
    placeHolder: 'ZIP Code',
  },
  profilePhoto: {
    value: '',
    key: 'profilePhoto',
    error: undefined,
    rule: '',
    label: '',
    src: '',
    base64String: '',
    responseUrl: '',
  },
};

export const PROFILE_PHOTO_EXTENSIONS = ['jpeg', 'jpg', 'png'];

export const PROFILE_PHOTO_BYTES = 5242880;

export const COUNTRY_CODES = {
  US: '91',
};

export const TRANSACTION_TYPES = [
  { text: 'Deposit', value: 'Deposit' },
  { text: 'Withdrawal', value: 'Withdrawal' },
  { text: 'Repayment', value: 'Repayment' },
  { text: 'Interest Accured', value: 'Interest Accured' },
  { text: 'Referral Credits', value: 'Referral Credits' },
];
