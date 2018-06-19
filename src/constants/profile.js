import Validator from 'validatorjs';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
Validator.register('maskedPhoneNumber', (value, requirement, attribute) => {
  return value.match(/^\d{3}-\d{3}-\d{4}$/);
}, 'The :attribute is not in the format XXX-XXX-XXXX.');

Validator.register('maskedSSN', (value, requirement, attribute) => {
  return value.match(/^\d{3}-\d{2}-\d{4}$/);
}, 'The :attribute is not in the format XXX-XX-XXXX.');

export const VERIFY_IDENTITY_STEP_01 = {
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

export const VERIFY_IDENTITY_STEP_04 = {
  code: {
    value: '',
    label: 'Enter your verification code here:',
    error: undefined,
    rule: 'required|numeric',
  },
};

export const PROFILE_DETAILS_TITLE = [
  { key: 'Mr', value: 'Mr', text: 'Mr' },
  { key: 'Ms', value: 'Ms', text: 'Ms' },
  { key: 'Mrs', value: 'Mrs', text: 'Mrs' },
];

export const CONFIRM_IDENTITY_DOCUMENTS = {
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
};
