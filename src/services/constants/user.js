import Validator from 'validatorjs';
import moment from 'moment';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
Validator.register(
  'maskedSSN', (value, attribute) => {
    return value.toString().length === 9;
  },
  'The :attribute is not in the format XXX-XX-XXXX.',
);

Validator.register(
  'dob', (value, attribute) => {
    return moment(value, 'MM/DD/YYYY').isBefore(moment());
  },
  "The :attribute should be less than today's date.",
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
  // {
  //   title: 'Social Connect',
  //   description: `Your NextSeed account is not connected to any social media.
  //   If you wish to connect it now, click one of the button below.`,
  //   action: ['social-connect'],
  // },
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
    placeHolder: 'Select',
    error: undefined,
    rule: 'required',
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
    objRef: 'legalDetails.legalName',
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
    objRef: 'legalDetails.legalName',
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
    objRef: 'legalDetails.legalAddress',
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
    objRef: 'legalDetails.legalAddress',
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
    objRef: 'legalDetails.legalAddress',
  },
  zipCode: {
    key: 'zipCode',
    value: '',
    label: 'Zip Code',
    placeHolder: '10011',
    error: undefined,
    rule: 'required|maskedField:5',
    customErrors: {
      required: '* required.',
      maskedField: 'The ZIP Code should be at least 5 digits',
    },
    objRef: 'legalDetails.legalAddress',
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
      maskedPhoneNumber: 'The phone number is not in the format XXX-XXX-XXXX.',
    },
  },
  dateOfBirth: {
    key: 'dateOfBirth',
    value: '',
    label: 'Date of Birth',
    placeHolder: 'mm/dd/yyyy',
    error: undefined,
    rule: 'required|date|dob',
    customErrors: {
      required: '* required.',
    },
    objRef: 'legalDetails',
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
    objRef: 'legalDetails',
  },
  mfaMethod: {
    key: 'mfaMethod',
    value: 'TEXT',
    values: [{ label: 'Text', value: 'TEXT' }, { label: 'Call', value: 'CALL' }],
    label: 'How would you want to receive the MFA Code ?',
    error: undefined,
    rule: 'optional',
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
    rule: 'required|min:6',
  },
};

export const UPDATE_PROFILE_INFO = {
  firstName: {
    value: '',
    label: 'First name',
    error: undefined,
    rule: 'required',
    placeHolder: 'First name',
    objRef: 'info',
  },
  lastName: {
    value: '',
    label: 'Last name',
    error: undefined,
    rule: 'required',
    placeHolder: 'Last name',
    objRef: 'info',
  },
  phoneNumber: {
    value: '',
    label: 'Phone Number',
    error: undefined,
    rule: 'string',
    placeHolder: 'Phone Number',
    objRef: 'phone',
  },
  email: {
    value: '',
    label: 'Email',
    error: undefined,
    rule: 'required|email',
    placeHolder: 'Email',
    objRef: 'email',
  },
  street: {
    value: '',
    label: 'Residential Street',
    error: undefined,
    rule: 'string',
    placeHolder: 'Residential Street',
  },
  city: {
    value: '',
    label: 'City',
    error: undefined,
    rule: 'string',
    placeHolder: 'City',
  },
  state: {
    value: '',
    label: 'State',
    error: undefined,
    rule: 'string',
  },
  zipCode: {
    value: '',
    label: 'ZIP Code',
    error: undefined,
    rule: 'optional',
    placeHolder: 'ZIP Code',
  },
  profilePhoto: {
    value: '',
    key: 'profilePhoto',
    error: undefined,
    fileName: '',
    rule: '',
    label: '',
    src: '',
    base64String: '',
    responseUrl: '',
  },
};

export const USER_PROFILE_FOR_ADMIN = {
  firstName: { ...UPDATE_PROFILE_INFO.firstName },
  lastName: { ...UPDATE_PROFILE_INFO.lastName },
  number: { ...UPDATE_PROFILE_INFO.phoneNumber },
  address: { ...UPDATE_PROFILE_INFO.email },
  ...USER_IDENTITY,
  street: { ...USER_IDENTITY.residentalStreet },
  capabilities: {
    value: [],
    key: 'capabilities',
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
  US: '1',
};

export const TRANSACTION_TYPES = [
  { text: 'Deposit', value: 'DEPOSIT' },
  { text: 'Withdrawal', value: 'WITHDRAWAL' },
  { text: 'Payment', value: 'REPAYMENT' },
  { text: 'Interest', value: 'INTEREST' },
  { text: 'Investment', value: 'INVESTMENT' },
  { text: 'Referral credits', value: 'REFERRAL_CREDITS' },
  { text: 'Late fee', value: 'LATE_FEE' },
];

export const DATE_RANGES = [
  { text: 'All', value: 'all' },
  { text: 'Last 30 days', value: '30' },
  { text: 'Last 60 days', value: '60' },
  { text: 'Last 90 days', value: '90' },
];
