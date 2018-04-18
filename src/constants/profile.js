import moment from 'moment';

export const VERIFY_IDENTITY_STEP_01 = {
  title: {
    value: '',
    label: 'Title',
    error: undefined,
    rule: 'required',
  },
  firstLegalName: {
    value: '',
    label: 'First Legal Name',
    error: undefined,
    rule: 'required',
  },
  lastLegalName: {
    value: '',
    label: 'Last Legal Name',
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
    rule: 'required',
  },
  phoneNumber: {
    value: '',
    label: 'Phone Number',
    error: undefined,
    rule: 'required',
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
    rule: 'required|numeric',
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

