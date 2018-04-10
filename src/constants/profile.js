import moment from 'moment';

export const PROFILE_DETAILS = {
  title: {
    value: '',
    key: 'title',
    error: undefined,
    rule: 'required',
    label: 'Title',
  },
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
    rule: 'required|numeric',
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
  code: {
    value: '',
    key: 'code',
    error: undefined,
    rule: 'required|numeric|digits:6',
    label: 'Enter verification code here:',
  },
};

export const PROFILE_DETAILS_TITLE = [
  { key: 'Mr', value: 'Mr', text: 'Mr' },
  { key: 'Ms', value: 'Ms', text: 'Ms' },
  { key: 'Mrs', value: 'Mrs', text: 'Mrs' },
];

export const IDENTITY_QUESTIONS_FORM_VALUES = {
  question1: {
    value: '',
    key: 'question1',
    error: undefined,
    rule: 'required',
    label: 'In which city is Baker Street?',
    placeHolder: 'Type answer',
  },
  question2: {
    value: '',
    key: 'question2',
    error: undefined,
    rule: 'required',
    label: 'From whom did you purchase the property at Baker Street 221?',
    placeHolder: 'Type answer',
  },
  question3: {
    value: '',
    key: 'question3',
    error: undefined,
    rule: 'required',
    label: 'In which country have you lived?',
    placeHolder: 'Type answer',
  },
  question4: {
    value: '',
    key: 'question4',
    error: undefined,
    rule: 'required',
    label: 'Between 1979 and 1980, in which state you have lived?',
    placeHolder: 'Type answer',
  },
};

export const CONFIRM_IDENTITY_DOCUMENTS = {
  photoId: {
    key: 'photoId',
    nameOfUploadedFile: '',
  },
  proofOfResidence: {
    key: 'proofOfResidence',
    nameOfUploadedFile: '',
  },
};

