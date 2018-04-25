import moment from 'moment';
import Validator from 'validatorjs';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
Validator.register('maskedInput', (value, requirement, attribute) => {
  return value.match(/^\d{3}-\d{3}-\d{4}$/);
}, 'The :attribute is not in the format XXX-XXX-XXXX.');

export const VERIFY_IDENTITY_STEP_01 = {
  title: {
    value: '',
    label: 'Title',
    error: undefined,
    rule: 'string',
  },
  firstLegalName: {
    value: '',
    label: 'First Legal Name',
    error: undefined,
    rule: 'required',
    tooltip: 'Put your first name as listed on your driver license',
  },
  lastLegalName: {
    value: '',
    label: 'Last Legal Name',
    error: undefined,
    rule: 'required',
    tooltip: 'Put your last name as listed on your driver license',
  },
  residentalStreet: {
    value: '',
    label: 'Residental Street',
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
    rule: 'required|maskedInput',
  },
  dateOfBirth: {
    value: moment(),
    label: 'Date of Birth',
    error: undefined,
    rule: 'required',
  },
  ssn: {
    value: '',
    label: 'SSN',
    error: undefined,
    rule: 'required|maskedInput',
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
  },
  proofOfResidence: {
    key: 'proofOfResidence',
    value: '',
    error: undefined,
    rule: 'required',
  },
};

