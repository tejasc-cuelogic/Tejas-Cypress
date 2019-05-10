import Validator from 'validatorjs';
import moment from 'moment';
import Aux from 'react-aux';
import React from 'react';
import { Popup } from 'semantic-ui-react';

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
  'afterDate', (value, attribute) => {
    return moment(value, 'MM/DD/YYYY').isAfter(new Date('12/31/1909')) &&
      moment(value, 'MM/DD/YYYY', true).isValid();
  },
  'Invalid Date',
);
Validator.register(
  'leastAge', (value, attribute) => {
    return moment().diff(new Date(value), 'years') >= 18;
  },
  'Investor must be at least 18 years old in order to proceed',
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
    title: 'Multi-Factor Authentication',
    description:
      (
        <Aux>You can choose your{' '}
          <Popup wide position="top center" trigger={<span className="underline-text" >Active MFA</span>}>
            <Popup.Header className="grey-header">Active MFA Factor</Popup.Header>
            <Popup.Content>
              Manage your MFA contact preferences. All major actions in your account will
              require additional confirmation with a code sent to your phone or email address.
            </Popup.Content>
          </Popup>
        </Aux>
      ),
    descriptionNotAvailable: '',
    action: ['mfa', 'Select Your Active MFA'],
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
    rule: 'required|alpha',
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
    rule: 'required|alpha',
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
  streetTwo: {
    key: 'streetTwo',
    value: '',
    label: 'Address Line 2',
    placeHolder: 'Address Line 2',
    error: undefined,
    rule: 'optional',
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
    placeHolder: '(123) 456-7890',
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
    rule: 'required|date|dob|leastAge|afterDate',
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
    label: 'How would you like to receive the MFA Code ?',
    error: undefined,
    rule: 'optional',
  },
};

export const USER_TITLE = [
  { key: 'Mr', value: 'Mr', text: 'Mr.' },
  { key: 'Ms', value: 'Ms', text: 'Ms.' },
  { key: 'Mrs', value: 'Mrs', text: 'Mrs.' },
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
  streetTwo: {
    value: '',
    label: 'Address Line 2',
    error: undefined,
    rule: 'optional',
    placeHolder: 'Address Line 2',
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
    meta: '',
    label: '',
    src: '',
    base64String: '',
    responseUrl: '',
  },
};

export const USER_PROFILE_ADDRESS_ADMIN = {
  street: {
    value: '',
    label: 'Residential Street',
    error: undefined,
    rule: 'string',
    placeHolder: 'Residential Street',
    objRef: 'info.mailingAddress',
  },
  streetTwo: {
    value: '',
    label: 'Address Line 2',
    error: undefined,
    rule: 'string',
    placeHolder: 'Address Line 2',
    objRef: 'info.mailingAddress',
  },
  city: {
    value: '',
    label: 'City',
    error: undefined,
    rule: 'string',
    placeHolder: 'City',
    objRef: 'info.mailingAddress',
  },
  state: {
    value: '',
    label: 'State',
    error: undefined,
    rule: 'string',
    objRef: 'info.mailingAddress',
  },
  zipCode: {
    value: '',
    label: 'ZIP Code',
    error: undefined,
    rule: 'optional',
    placeHolder: 'ZIP Code',
    objRef: 'info.mailingAddress',
  },
};

export const USER_PROFILE_FOR_ADMIN = {
  firstName: { ...UPDATE_PROFILE_INFO.firstName },
  lastName: { ...UPDATE_PROFILE_INFO.lastName },
  number: { ...UPDATE_PROFILE_INFO.phoneNumber },
  address: { ...UPDATE_PROFILE_INFO.email },
  firstLegalName: { ...USER_IDENTITY.firstLegalName },
  lastLegalName: { ...USER_IDENTITY.lastLegalName },
  ssn: { ...USER_IDENTITY.ssn },
  dateOfBirth: { ...USER_IDENTITY.dateOfBirth },
  street: { ...USER_IDENTITY.residentalStreet },
  streetTwo: { ...USER_IDENTITY.streetTwo },
  city: { ...USER_IDENTITY.city },
  state: { ...USER_IDENTITY.state },
  zipCode: { ...USER_IDENTITY.zipCode },
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
  { text: 'Deposit', value: 'Deposit' },
  { text: 'Withdrawal', value: 'Withdrawal' },
  { text: 'Payment', value: 'Payment' },
  { text: 'Interest', value: 'Interest' },
  { text: 'Investment', value: 'Investment' },
  { text: 'Referral credits', value: 'Credit' },
  { text: 'Late fee', value: 'Late Fee' },
];

export const DATE_RANGES = [
  { text: 'All', value: 'all' },
  { text: 'Last 30 days', value: '30' },
  { text: 'Last 60 days', value: '60' },
  { text: 'Last 90 days', value: '90' },
];
