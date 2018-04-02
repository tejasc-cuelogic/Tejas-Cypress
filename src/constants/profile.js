import moment from 'moment';

export const PROFILE_DETAILS = {
  firstLegalName: {
    value: '',
    key: 'firstLegalName',
    error: undefined,
    rule: 'required',
    label: 'First Legal Name',
  },
  lastLegalName: {
    value: '',
    key: 'lastLegalName',
    error: undefined,
    rule: 'required',
    label: 'Last Legal Name',
  },
  residentalStreet: {
    value: '',
    key: 'residentalStreet',
    error: undefined,
    rule: 'required',
    label: 'Residental Street',
  },
  city: {
    value: '',
    key: 'city',
    error: undefined,
    rule: 'required',
    label: 'City',
  },
  state: {
    value: '',
    key: 'state',
    error: undefined,
    rule: 'required',
    label: 'State',
  },
  zipCode: {
    value: '',
    key: 'zipCode',
    error: undefined,
    rule: 'required',
    label: 'Zip Code',
  },
  phoneNumber: {
    value: '',
    key: 'phoneNumber',
    error: undefined,
    rule: 'required',
    label: 'Phone Number',
  },
  dateOfBirth: {
    value: moment(),
    key: 'dateOfBirth',
    error: undefined,
    rule: 'required',
    label: 'Date of Birth',
  },
  ssn: {
    value: '',
    key: 'ssn',
    error: undefined,
    rule: 'required',
    label: 'SSN',
  },
};
