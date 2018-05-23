// import moment from 'moment';

export const USER_ROLES = ['admin', 'bowner', 'investor'];
export const USER_TYPES_META = [
  {
    key: 'i', icon: 'ns-investor', text: 'Investor', value: 'investor', desc: 'Invest in existing businesses and get revenue',
  },
  {
    key: 'o', icon: 'ns-business', text: 'Business Owner', value: 'bowner', desc: 'Apply for funding with your business',
  },
];

export const USER_LIST_META = [
  ['profilepic', '', false],
  ['firstName', 'Full Name', false],
  ['city', 'Residence City', false],
  ['number', 'Phone Number', false],
  ['accountType', 'Account Types', false],
  ['createdDate', 'Account Creation', true],
  ['lastLoginDate', 'Last Login', true],
  ['actions', '', false],
];

export const USER_DETAIL_SECTIONS = ['Profile', 'Limits', 'Beneficiaries', 'Portfolio', 'Transactions', 'Statements', 'Bonus rewards', 'Messages'];

// Filters
export const FILTER_META = {
  accountType: [
    { text: 'Admin', value: 'admin' },
    { text: 'Business', value: 'bowner' },
    { text: 'IRA', value: 'ira' },
    { text: 'Individual', value: 'individual' },
    { text: 'Entity', value: 'entity' },
  ],
  accountStatus: [
    { text: 'Unlocked', value: 'unlocked' },
    { text: 'Locked', value: 'locked' },
  ],
  accreditation: [
    { text: 'Accridiated', value: 'yes' },
    { text: 'Non-Accridiated', value: 'no' },
  ],
  city: [
    { text: 'Greenfields', value: 'greenfields' },
    { text: 'Bartley', value: 'bartley' },
  ],
  state: [
    { text: 'Alabama', value: 'alabama' },
    { text: 'Alaska', value: 'alaska' },
    { text: 'Arizona', value: 'arizona' },
    { text: 'Arkansas', value: 'arkansas' },
    { text: 'California', value: 'california' },
    { text: 'Colorado', value: 'colorado' },
    { text: 'Connecticut', value: 'connecticut' },
    { text: 'Delaware', value: 'delaware' },
    { text: 'West Virginia', value: 'west virginia' },
  ],
};
/* eslint-disable */
export const USER_POOL = {"id":"5acc7be47498ac534eed4f84","email":"pickettbryan@securia.com","firstName":"Ada","lastName":"Mccullough","createdDate":"2015-03-07T06:02:12 -06:-30","updatedDate":"2018-01-16T01:47:07 -06:-30","legalDetails":{"verificationStartDate":"2014-01-07T04:21:39 -06:-30","verificationCompletionDate":"2014-05-14T12:34:12 -06:-30","legalName":{"firstLegalName":"Tanner","lastLegalName":"Guerra"},"dateOfBirth":"02-03-1980","ssn":"145-47-8825","legalAddress":{"street1":"Willow Street","street2":"Coles Street","city":"Lisco","state":"Connecticut","zipCode":2103}},"contactDetails":{"email":{"email":"tannerguerra@securia.com","verificationDate":"2017-11-29T11:46:08 -06:-30"},"phone":{"number":"+1 (871) 523-3343"}}};

export const RANDOM_USER = () => {
  return USER_POOL;
}

export const TRANSACTION_TYPES = [
  { text: 'Deposit', value: 'Deposit' },
  { text: 'Withdrawal', value: 'Withdrawal' },
  { text: 'Repayment', value: 'Repayment' },
  { text: 'Interest', value: 'Interest' },
  { text: 'Accured', value: 'Accured' },
  { text: 'Referral Credits', value: 'ReferralCredits' },
];


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
};

export const FIN_INFO = {
  annualIncome: {
    value: '',
    label: 'Annual Income',
    error: undefined,
    rule: 'required|numeric',
    tooltip: 'Mention your Annual Income here',
  },
  netWorth: {
    value: '',
    label: 'Net Worth',
    error: undefined,
    rule: 'required|numeric',
    tooltip: 'Mention your Net Worth here',
  },
  otherInvestments: {
    value: '',
    label: 'Other Regulation Crowdfunding investments made in prior 12 months',
    error: undefined,
    rule: 'required|numeric',
    tooltip: 'Other Crowdfunding investments',
  },
  currentLimit: {
    value: '',
    label: 'Your current investment limit',
    error: undefined,
    rule: 'numeric',
  },
};