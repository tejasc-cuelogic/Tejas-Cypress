import { COMMON } from './auth';

export const BENEFICIARY_FRM = {
  beneficiary: [{
    firstName: {
      value: '',
      label: 'First Name',
      error: undefined,
      rule: 'required',
      placeHolder: 'John',
      customErrors: {
        required: '* required.',
      },
    },
    lastName: {
      value: '',
      label: 'Last Name',
      error: undefined,
      rule: 'required',
      placeHolder: 'Smith',
      customErrors: {
        required: '* required.',
      },
    },
    dob: {
      value: null,
      label: 'Date of birth',
      error: undefined,
      rule: 'required',
      placeHolder: '01-01-1989',
      customErrors: {
        required: '* required.',
      },
    },
    relationship: {
      value: '',
      label: 'Relationship to Account Holder',
      error: undefined,
      rule: 'required',
      placeHolder: 'Son',
      customErrors: {
        required: '* required.',
      },
    },
    residentalStreet: {
      value: '',
      label: 'Residential Street',
      error: undefined,
      rule: 'required',
      placeHolder: '139 Street',
      customErrors: {
        required: '* required.',
      },
    },
    city: {
      value: '',
      label: 'City',
      error: undefined,
      rule: 'required',
      placeHolder: 'New York',
      customErrors: {
        required: '* required.',
      },
    },
    state: {
      value: '',
      label: 'State',
      error: undefined,
      rule: 'required',
      placeHolder: 'NY',
      customErrors: {
        required: '* required.',
      },
    },
    zipCode: {
      value: '',
      label: 'ZIP code',
      error: undefined,
      rule: 'required|numeric',
      placeHolder: '12345',
      customErrors: {
        required: '* required.',
        numeric: 'Allowed only numbers.',
      },
    },
    share: {
      value: '',
      label: '',
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
    customErrors: {
      required: '* required.',
    },
  },
};
