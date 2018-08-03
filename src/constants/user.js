// import moment from 'moment';

export const USER_ROLES = ['admin', 'issuer', 'investor'];
export const USER_TYPES_META = [
  {
    key: 'i', icon: 'ns-investor', text: 'Investor', value: 'investor', desc: 'Invest in existing businesses and get revenue',
  },
  {
    key: 'o', icon: 'ns-business', text: 'Business Owner', value: 'issuer', desc: 'Apply for funding with your business',
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

export const FILTER_META = {
  accountType: [
    { text: 'Admin', value: 'admin' },
    { text: 'Business', value: 'issuer' },
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
  businessAppSortOption: [
    { text: 'Started date (ascending)', value: 'unlocked' },
    { text: 'Started date (locked)', value: 'locked' },
    { text: 'Released', value: 'released' },
  ],
  applicationStatus: {
    value: ['New'],
    values: [
      {
        label: 'New',
        value: 'New',
      },
      {
        label: 'Accepted',
        value: 'Accepted',
      },
      {
        label: 'Declined',
        value: 'Declined',
      },
      {
        label: 'Reviewing',
        value: 'Reviewing',
      },
      {
        label: 'Offered',
        value: 'Offered',
      },
      {
        label: 'Deleted',
        value: 'Deleted',
      },
      {
        label: 'Unstashed',
        value: 'Unstashed',
      },
      {
        label: 'Stashed',
        value: 'Stashed',
      },
    ],
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

export const ROLES = [
  { key: 'admin', value: 'admin', text: 'Admin' },
  { key: 'issuer', value: 'issuer', text: 'Business Owner' },
  { key: 'investor', value: 'investor', text: 'Investor' },
];

export const NEW_USER = {
  givenName: {
    value: '', label: 'First Name', error: undefined, rule: 'required',
  },
  familyName: {
    value: '', label: 'Last Name', error: undefined, rule: 'required',
  },
  email: {
    value: '', label: 'Email address', error: undefined, rule: 'required|email',
  },
  TemporaryPassword: {
    value: '', label: 'Temporary Password', error: undefined, rule: 'required|min:8|max:15',
  },
  verifyPassword: {
    value: '', label: 'Verify Password', error: undefined, rule: 'required|same:TemporaryPassword',
  },
  role: {
    value: [], label: 'Role', error: undefined, rule: 'required',
  },
};

export const BENEFICIARY_STATUS = { PENDING: 'PENDING', APPROVED: 'APPROVED' };

export const SIGNUP_REDIRECT_ROLEWISE = [{ role: 'admin', path: '/app/dashboard' }, { role: 'issuer', path: '/app/business-application/new/pre-qualification' }, { role: 'investor', path: '/app/summary/identity-verification/0' }];
