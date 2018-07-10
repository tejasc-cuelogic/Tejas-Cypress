import { COMMON } from './auth';

export const BENEFICIARY_FRM = {
  beneficiary: [{
    firstName: {
      value: '',
      label: 'First name',
      error: undefined,
      rule: 'required',
    },
    lastName: {
      value: '',
      label: 'Last Name',
      error: undefined,
      rule: 'required',
    },
    dob: {
      value: null,
      label: 'Date of birth',
      error: undefined,
      rule: 'required',
    },
    relationship: {
      value: '',
      label: 'Relationship to Account Holder',
      error: undefined,
      rule: 'required',
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
      label: 'ZIP code',
      error: undefined,
      rule: 'required|numeric',
    },
    share: {
      value: '',
      label: '',
      // label: 'Shares percentage',
      error: undefined,
      rule: 'optional',
      // rule: 'required|sharePercentage:share',
      // tooltip: 'Tooltip content',
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
