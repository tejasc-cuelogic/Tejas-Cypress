const INVESTER_ACC_SUB_NAV_ITEMS = {
  subNavigations: [
    { title: 'Portfolio', to: 'portfolio' },
    { title: 'Transfer Funds', to: 'transfer-funds' },
    { title: 'Bank Accounts', to: 'bank-accounts' },
    { title: 'Activity', to: 'activity' },
    { title: 'Statements', to: 'statements' },
  ],
};

/*
subPanel => 0: none, 1: subnavigation, 2: has search panel
*/

export const ALL_NAV_ITEMS = [
  {
    title: 'Settings',
    to: 'settings',
    heading: 'Profile Settings',
    subPanel: 1,
    accessibleTo: [],
    subNavigations: [
      { title: 'Profile Data', to: 'profile-data' },
      { title: 'Investment limits', to: 'investment-limits' },
      { title: 'Security', to: 'security' },
      { title: 'Beneficiaries', to: 'beneficiaries' },
    ],
  },
  {
    icon: 'ns-envelope',
    title: 'Messages',
    to: 'messages',
    accessibleTo: [],
  },
  {
    icon: 'ns-users',
    title: 'Manage users',
    to: 'users',
    accessibleTo: ['admin'],
    subNavigations: [
      { title: 'Profile', to: 'profile' },
      { title: 'Limits', to: 'limits' },
    ],
  },
  {
    icon: 'feed',
    title: 'Manage blog',
    to: 'blog',
    accessibleTo: ['admin', 'editor'],
    subNavigations: [],
  },
  {
    icon: 'question',
    title: 'Manage FAQ',
    to: 'faq',
    accessibleTo: ['admin', 'editor'],
    subNavigations: [],
  },
  {
    icon: 'ns-dashboard',
    title: 'Dashboard',
    to: 'dashboard',
    accessibleTo: ['bowner'],
    subPanel: 0,
  },
  {
    icon: 'ns-dashboard',
    title: 'Summary',
    to: 'summary',
    accessibleTo: ['ira', 'individual', 'entity', 'investor'],
    subPanel: 0,
  },
  {
    icon: 'ns-individual-line',
    title: 'Individual',
    heading: 'Individual Account',
    to: 'account-details/individual',
    accessibleTo: ['individual', 'investor'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-ira-line',
    title: 'IRA',
    heading: 'IRA Account',
    to: 'account-details/ira',
    accessibleTo: ['ira', 'investor'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-entity-line',
    title: 'Entity',
    heading: 'Entity Account',
    to: 'account-details/entity',
    accessibleTo: ['entity', 'investor'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-wallet',
    title: 'Rewards wallet',
    to: 'rewards-wallet',
    accessibleTo: ['ira', 'individual', 'entity', 'investor'],
  },
  {
    icon: 'chain',
    title: 'Referrals',
    to: 'referrals',
    accessibleTo: ['ira', 'individual', 'entity', 'investor'],
  },
  {
    icon: 'book',
    title: 'Education',
    to: 'education',
    accessibleTo: ['ira', 'individual', 'entity', 'investor', 'bowner'],
    subPanel: 1,
    subNavigations: [
      { title: 'Welcome Packet', to: 'welcome-packet' },
      { title: 'Knowledge Base', to: 'Knowledge-base' },
      { title: 'FAQ', to: 'faq' },
    ],
  },
  {
    icon: 'calendar',
    title: 'Events',
    to: 'events',
    accessibleTo: ['bowner'],
  },
];
