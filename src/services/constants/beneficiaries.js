import { COMMON } from './auth';

export const BENEFICIARY_FRM = {
  beneficiary: [{
    firstName: {
      value: '',
      label: 'First name',
      error: undefined,
      rule: 'required',
      placeHolder: 'John',
    },
    lastName: {
      value: '',
      label: 'Last Name',
      error: undefined,
      rule: 'required',
      placeHolder: 'Smith',
    },
    dob: {
      value: null,
      label: 'Date of birth',
      error: undefined,
      rule: 'required',
      placeHolder: '01-01-1989',
    },
    relationship: {
      value: '',
      label: 'Relationship to Account Holder',
      error: undefined,
      rule: 'required',
      placeHolder: 'Son',
    },
    residentalStreet: {
      value: '',
      label: 'Residental Street',
      error: undefined,
      rule: 'required',
      placeHolder: '139 Street',
    },
    city: {
      value: '',
      label: 'City',
      error: undefined,
      rule: 'required',
      placeHolder: 'New York',
    },
    state: {
      value: '',
      label: 'State',
      error: undefined,
      rule: 'required',
      placeHolder: 'NY',
    },
    zipCode: {
      value: '',
      label: 'ZIP code',
      error: undefined,
      rule: 'required|numeric',
      placeHolder: '12345',
    },
    share: {
      value: '',
      label: '',
      // label: 'Shares percentage',
      error: undefined,
      placeHolder: '50%',
      rule: 'optional',
    },
  }],
};

export const VERIFY_OTP = {
  code: { ...COMMON.code },
};

export const DISPLAY_NUMBER = {
  phoneNumber: {
    value: '',
    label: '',
    error: undefined,
    rule: 'required',
  },
};
