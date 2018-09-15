// import moment from 'moment';

export const USER_ROLES = ['admin', 'issuer', 'investor'];
export const USER_TYPES_META = [
  {
    key: 'i', icon: 'ns-investor', text: 'Investor', value: 'investor', desc: 'Invest in existing businesses and get revenue',
  },
  {
    key: 'o', icon: 'ns-business', text: 'Business', value: 'issuer-type1', desc: 'Apply for funding for your business',
  },
  {
    key: 'bo', icon: 'ns-appartment', text: 'Commercial Real Estate', value: 'issuer-type2', desc: 'Apply for real estate funding',
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
  businessAppSortField: [
    { text: 'Submitted date (ascending)', value: 'applicationSubmittedDate|asc' },
    { text: 'Submitted date (descending)', value: 'applicationSubmittedDate|desc' },
  ],
  applicationStatus: {
    value: [],
    values: [
      { label: 'New', value: 'NEW', applicable: ['completed'] },
      { label: 'Accepted', value: 'ACCEPTED', applicable: ['completed'] },
      { label: 'Declined', value: 'DECLINED', applicable: ['completed'] },
      { label: 'Reviewing', value: 'REVIEWING', applicable: ['completed'] },
      { label: 'Offered', value: 'OFFERED', applicable: ['completed'] },
      { label: 'Unstashed', value: 'UNSTASH', applicable: ['in-progress'] },
      { label: 'Stashed', value: 'STASH', applicable: ['in-progress'] },
      { label: 'Deleted', value: 'DELETED', applicable: ['prequal-failed', 'in-progress', 'completed'] },
    ],
  },
  activityType: [
    { label: 'Comment', value: 'COMMENT' },
    { label: 'Activity', value: 'ACTIVITY' },
    { label: 'Upload', value: 'UPLOAD' },
    { label: 'Rating', value: 'RATING' },
    { label: 'Cf limit', value: 'CF_LIMIT' },
    { label: 'Accreditation', value: 'ACCREDITATION' },
    { label: 'Access', value: 'ACCESS' },
    { label: 'Admin Activity', value: 'ADMIN_ACTIVITY' },
    { label: 'MFA', value: 'MFA' },
    { label: 'Profile Update', value: 'PROFILE_UPDATE' },
  ],
  activityUserType: [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'Issuer', value: 'ISSUER' },
    { label: 'Investor', value: 'INVESTOR' },
  ],
};

export const TRANSACTION_TYPES = [
  { text: 'Deposit', value: 'Deposit' },
  { text: 'Withdrawal', value: 'Withdrawal' },
  { text: 'Repayment', value: 'Repayment' },
  { text: 'Interest Accured', value: 'InterestAccured' },
  { text: 'Referral Credits', value: 'ReferralCredits' },
];

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
