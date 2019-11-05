import Validator from 'validatorjs';
import moment from 'moment';
import React from 'react';
// import { Popup } from 'semantic-ui-react';

/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */

Validator.register(
  'dob', (value, attribute) => {
    return moment(value, 'MM/DD/YYYY').isBefore(moment());
  },
  "The :attribute should be less than today's date.",
);
Validator.register(
  'afterDate', (value, attribute) => {
    return moment(value, 'MM/DD/YYYY').isAfter(new Date('12/31/1909'))
      && moment(value, 'MM/DD/YYYY', true).isValid();
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
    description: 'We strongly recommend that you update your password regularly.',
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
        <>Our MFA security feature gives your account an extra layer of protection.
          {/* <Popup wide position="top center" trigger={<span className="underline-text">Active MFA</span>}>
            <Popup.Header className="grey-header">Active MFA Factor</Popup.Header>
            <Popup.Content>
              Manage your MFA contact preferences. All major actions in your account will
              require additional confirmation with a code sent to your phone or email address.
            </Popup.Content>
          </Popup> */}
        </>
      ),
    descriptionNotAvailable: '',
    action: ['mfa', 'Select Your Active MFA'],
  },
];

export const USER_IDENTITY = {
  salutation: {
    key: 'salutation',
    value: '',
    label: 'Title',
    placeHolder: 'Select',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
    objRefOutput: 'legalName',
    objRef: 'legalDetails.legalName',
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
    objRefOutput: 'legalName',
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
    objRefOutput: 'legalName',
    objRef: 'legalDetails.legalName',
  },
  street: {
    key: 'street',
    value: '',
    label: 'Residential Address',
    placeHolder: 'Street Address, City, State, Zip',
    error: undefined,
    rule: 'required',
    customErrors: {
      required: '* required.',
    },
    objRefOutput: 'legalAddress',
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
    skipField: true,
    objRefOutput: 'legalAddress',
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
    objRefOutput: 'legalAddress',
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
    objRefOutput: 'legalAddress',
    objRef: 'legalDetails.legalAddress',
  },
  zipCode: {
    key: 'zipCode',
    value: '',
    showError: true,
    label: 'Zip Code',
    placeHolder: '10011',
    error: undefined,
    rule: 'required|maskedField:5',
    customErrors: {
      required: '* required.',
      maskedField: 'The ZIP Code should be at least 5 digits',
    },
    objRefOutput: 'legalAddress',
    objRef: 'legalDetails.legalAddress',
  },
  phoneNumber: {
    key: 'phoneNumber',
    value: '',
    label: 'Phone Number',
    showError: true,
    format: '(###) ###-####',
    type: 'tel',
    placeHolder: '(123) 456-7890',
    error: undefined,
    rule: 'required|maskedPhoneNumber',
    skipField: true,
    objRef: 'phone',
    customErrors: {
      required: '* required.',
      maskedPhoneNumber: 'The phone number is not in the format XXX-XXX-XXXX.',
    },
  },
  dateOfBirth: {
    key: 'dateOfBirth',
    value: '',
    label: 'Date of Birth',
    showError: true,
    format: '##/##/####',
    placeHolder: 'mm/dd/yyyy',
    error: undefined,
    rule: 'required|date|dob|leastAge|afterDate',
    customErrors: {
      required: '* required.',
    },
    objRef: 'legalDetails',
    maskFormattedChange: 'formatted',
  },
  ssn: {
    key: 'ssn',
    value: '',
    label: 'Social Security Number',
    placeHolder: '123-456-7890',
    error: undefined,
    rule: 'required|maskedSSN',
    format: '###-##-####',
    customErrors: {
      required: '* required.',
    },
    objRef: 'legalDetails',
    showError: true,
  },
  mfaMethod: {
    key: 'mfaMethod',
    value: 'TEXT',
    values: [{ label: 'Text', value: 'TEXT' }, { label: 'Call', value: 'CALL' }],
    label: 'How would you like to receive the MFA Code ?',
    error: undefined,
    skipField: true,
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

export const FREEZE_FORM = {
  reason: {
    value: '',
    label: 'Reason:',
    error: undefined,
    rule: 'optional',
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
    rule: 'optional',
    placeHolder: 'Phone Number',
    objRef: 'phone',
  },
  email: {
    value: '',
    label: 'Email',
    error: undefined,
    rule: 'optional|email',
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
  street: { ...USER_IDENTITY.street, objRef: 'info.mailingAddress' },
  streetTwo: { ...USER_IDENTITY.streetTwo, objRef: 'info.mailingAddress' },
  city: { ...USER_IDENTITY.city, objRef: 'info.mailingAddress' },
  state: { ...USER_IDENTITY.state, objRef: 'info.mailingAddress' },
  zipCode: { ...USER_IDENTITY.zipCode, objRef: 'info.mailingAddress' },
};

export const USER_PROFILE_FOR_ADMIN = {
  firstName: { ...UPDATE_PROFILE_INFO.firstName },
  lastName: { ...UPDATE_PROFILE_INFO.lastName },
  number: { ...UPDATE_PROFILE_INFO.phoneNumber },
  address: { ...UPDATE_PROFILE_INFO.email },
  firstLegalName: { ...USER_IDENTITY.firstLegalName },
  lastLegalName: { ...USER_IDENTITY.lastLegalName },
  dateOfBirth: { ...USER_IDENTITY.dateOfBirth },
  street: { ...USER_IDENTITY.street },
  streetTwo: { ...USER_IDENTITY.streetTwo },
  city: { ...USER_IDENTITY.city },
  state: { ...USER_IDENTITY.state },
  zipCode: { ...USER_IDENTITY.zipCode },
  capabilities: {
    value: [],
    key: 'capabilities',
    error: undefined,
    rule: 'optional',
    label: '',
    src: '',
    base64String: '',
    responseUrl: '',
  },
  ssn: {
    key: 'ssn',
    value: '',
    label: 'Social Security Number',
    placeHolder: '******1234',
    error: undefined,
    rule: 'optional|maskedSSN',
    objRef: 'legalDetails',
  },
};

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
