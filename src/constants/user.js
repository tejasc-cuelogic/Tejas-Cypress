import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from './common';

export const USER_ROLES = [
  { key: 'admin', value: 'admin', text: 'Admin' },
  { key: 'issuer', value: 'issuer', text: 'Issuer' },
  { key: 'investor', value: 'investor', text: 'Investor' },
];

export const USER_TYPES_META = [
  {
    key: 'i', icon: 'ns-investor', text: 'Investor', value: 'investor', desc: 'Open an investment account', exclude: ['applynow'],
  },
  {
    key: 'o', icon: 'ns-business', text: 'Business', value: 'issuer-type1', desc: 'Apply for funding for your business', exclude: [],
  },
  {
    key: 'bo', icon: 'ns-appartment', text: 'Commercial Real Estate', value: 'issuer-type2', desc: 'Apply for real estate funding', exclude: [],
  },
];

export const USER_LIST_META = [
  ['profilepic', '', false],
  ['firstName', 'Full Name', false],
  ['zipZode', 'ZIP Code', false],
  ['number', 'Phone Number', false],
  ['accountType', 'Account Types', false],
  ['createdDate', 'Account Creation', true],
  ['lastLoginDate', 'Last Login', true],
  ['actions', '', false],
];

export const DELETED_ACCOUNT_STATUS = {
  PARTIAL: ['DELETED_INVESTOR_PARTIAL'],
  BASIC: ['DELETED_INVESTOR_BASIC'],
  FULL: ['DELETED_INVESTOR_FULL'],
  MIGRATION_PARTIAL: ['DELETED_INVESTOR_MIGRATION_PARTIAL'],
  MIGRATION_FULL: ['DELETED_INVESTOR_MIGRATION_FULL'],
  LOCKED: [''],
  UNLOCKED: [''],
  ISSUER: ['DELETED_ISSUER_ISSUER'],
  ADMIN: ['DELETED_ADMIN_ADMIN'],
  INVESTOR: ['DELETED_INVESTOR_PARTIAL', 'DELETED_INVESTOR_BASIC', 'DELETED_INVESTOR_FULL', 'DELETED_INVESTOR_MIGRATION_PARTIAL', 'DELETED_INVESTOR_MIGRATION_FULL'],
};

export const FILTER_META = {
  accountType: [
    { text: 'Admin', value: 'ADMIN' },
    { text: 'Business', value: 'ISSUER' },
    { text: 'Investor', value: 'INVESTOR' },
    { text: 'IRA', value: 'IRA' },
    { text: 'Individual', value: 'INDIVIDUAL' },
    { text: 'Entity', value: 'ENTITY' },
  ],
  accountStatus: [
    {
      text: 'Select Filter', key: '', value: '', allowedDeleted: true,
    },
    { text: 'Partial', value: 'PARTIAL', allowedDeleted: true },
    { text: 'Basic', value: 'BASIC', allowedDeleted: true },
    { text: 'Full', value: 'FULL', allowedDeleted: true },
    { text: 'Migration Partial', value: 'MIGRATION_PARTIAL', allowedDeleted: true },
    { text: 'Migration Full', value: 'MIGRATION_FULL', allowedDeleted: true },
    { text: 'Locked', value: 'LOCKED', allowedDeleted: false },
    { text: 'Unlocked', value: 'UNLOCKED', allowedDeleted: false },
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
      { label: 'NS Declined', value: 'REVIEW_FAILED', applicable: ['completed'] },
      { label: 'Issuer Declined', value: 'ISSUER_DECLINED', applicable: ['completed'] },
    ],
  },
  activityType: [
    { text: 'Comment', value: ACTIVITY_HISTORY_TYPES.COMMENT },
    { text: 'Activity', value: ACTIVITY_HISTORY_TYPES.ACTIVITY },
    { text: 'Upload', value: ACTIVITY_HISTORY_TYPES.UPLOAD },
    { text: 'Rating', value: ACTIVITY_HISTORY_TYPES.RATING },
    { text: 'Cf limit', value: ACTIVITY_HISTORY_TYPES.CF_LIMIT },
    { text: 'Accreditation', value: ACTIVITY_HISTORY_TYPES.ACCREDITATION },
    { text: 'Access', value: ACTIVITY_HISTORY_TYPES.ACCESS },
    { text: 'Admin Activity', value: ACTIVITY_HISTORY_TYPES.ADMIN_ACTIVITY },
    { text: 'MFA', value: ACTIVITY_HISTORY_TYPES.MFA },
    { text: 'Migration', value: ACTIVITY_HISTORY_TYPES.MIGRATION },
    { text: 'Prequalication', value: ACTIVITY_HISTORY_TYPES.PREQUAL },
    { text: 'Account', value: ACTIVITY_HISTORY_TYPES.ACCOUNT },
    { text: 'Offer', value: ACTIVITY_HISTORY_TYPES.OFFER },
    { text: 'Offering', value: ACTIVITY_HISTORY_TYPES.OFFERING },
    { text: 'Creation', value: ACTIVITY_HISTORY_TYPES.CREATION },
    { text: 'Live', value: ACTIVITY_HISTORY_TYPES.LIVE },
    { text: 'Elastic Search Job Id', value: ACTIVITY_HISTORY_TYPES.ES_JOBID },
  ],
  activityUserType: [
    { text: 'None', value: null, applicable: [] },
    { text: 'Admin', value: ACTIVITY_HISTORY_SCOPE.ADMIN, applicable: [] },
    { text: 'Issuer', value: ACTIVITY_HISTORY_SCOPE.ISSUER, applicable: [] },
    { text: 'Investor', value: ACTIVITY_HISTORY_SCOPE.INVESTOR, applicable: [] },
    { text: 'Dev', value: ACTIVITY_HISTORY_SCOPE.DEV, applicable: [] },
  ],
  subType: [
    { text: 'None', value: null },
    { text: 'Users', value: 'USERS' },
    { text: 'Users A', value: 'users_a' },
    { text: 'Users B', value: 'users_b' },
    { text: 'Linked Bank', value: 'LINKED_BANK' },
    { text: 'Linked Bank A', value: 'linkedbank_a' },
    { text: 'Linked Bank B', value: 'linkedbank_b' },
    { text: 'Acceditation', value: 'ACCREDITATION' },
    { text: 'Acceditation A', value: 'accreditations_a' },
    { text: 'Acceditation B', value: 'accreditations_b' },
    { text: 'CrowdPay', value: 'CROWDPAY' },
    { text: 'CrowdPay A', value: 'crowdpay_a' },
    { text: 'CrowdPay B', value: 'crowdpay_b' },
    { text: 'Offering', value: 'OFFERING' },
    { text: 'Offering A', value: 'offerings_a' },
    { text: 'Offering B', value: 'offerings_b' },
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
    value: '', label: 'Temporary Password', error: undefined, rule: 'required|min:8|max:40',
  },
  verifyPassword: {
    value: '', label: 'Verify Password', error: undefined, rule: 'required|same:TemporaryPassword',
  },
  role: {
    value: '', label: 'Role', error: undefined, rule: 'required',
  },
  capabilities: {
    value: '', label: 'Capabilities', error: undefined, rule: 'optional',
  },
};

export const BENEFICIARY_STATUS = { PENDING: 'PENDING', APPROVED: 'APPROVED' };

export const SIGNUP_REDIRECT_ROLEWISE = [{ role: 'admin', path: '/app' }, { role: 'issuer', path: '/app/business-application/new/pre-qualification' }, { role: 'investor', path: '/app/summary/identity-verification/0' }];
