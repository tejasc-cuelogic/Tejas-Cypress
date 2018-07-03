export const BENEFICIARY_FRM = {
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
    label: 'Date of Birth',
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
    label: 'Zip Code',
    error: undefined,
    rule: 'required|numeric',
  },
  share: {
    value: '',
    label: 'Share',
    error: undefined,
    rule: 'required|numeric',
  },
};

export const VERIFY_OTP = {
  code: {
    value: '',
    label: 'Enter your verification code here:',
    error: undefined,
    rule: 'required|numeric',
  },
};

export const DISPLAY_NUMBER = {
  phoneNumber: {
    value: '',
    label: '',
    error: undefined,
    rule: 'required',
  },
};
