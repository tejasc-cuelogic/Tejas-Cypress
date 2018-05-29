const INVESTER_ACC_SUB_NAV_ITEMS = {
  subNavigations: [
    { title: 'Portfolio', to: 'portfolio', component: 'Portfolio' },
    { title: 'Transfer Funds', to: 'transfer-funds', component: 'TransferFunds' },
    { title: 'Bank Accounts', to: 'bank-accounts', component: 'BankAccount' },
    { title: 'Transactions', to: 'transactions', component: 'Transactions' },
    { title: 'Statements', to: 'statements', component: 'Statements' },
  ],
};

/*
subPanel => 0: none, 1: subnavigation, 2: has search panel
*/

export const ALL_NAV_ITEMS = [
  {
    title: 'Settings',
    to: 'profile-settings',
    heading: 'Profile Settings',
    subPanel: 1,
    accessibleTo: [],
    subNavigations: [
      { title: 'Profile Data', to: 'profile-data', component: 'ProfileData' },
      { title: 'Investment limits', to: 'investment-limits', component: 'InvestmentLimits' },
      { title: 'Security', to: 'security', component: 'Security' },
      { title: 'Beneficiaries', to: 'beneficiaries', component: 'Beneficiaries' },
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
      { title: 'Limits', to: 'Limits' },
      { title: 'Beneficiaries', to: 'beneficiaries' },
      { title: 'Portfolio', to: 'portfolio' },
      { title: 'Transactions', to: 'transactions' },
      { title: 'Statements', to: 'statements' },
      { title: 'Bonus rewards', to: 'bonus-rewards' },
      { title: 'Messages', to: 'messages' },
    ],
  },
  {
    icon: 'feed',
    title: 'Manage blog',
    to: 'manage/blog',
    accessibleTo: ['admin', 'editor'],
    subNavigations: [],
  },
  {
    icon: 'question',
    title: 'Manage FAQ',
    to: 'manage/faq',
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
    icon: 'ns-individual',
    title: 'Individual',
    heading: 'Individual Account',
    to: 'account-details/individual',
    accessibleTo: ['individual', 'investor'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-ira',
    title: 'IRA',
    heading: 'IRA Account',
    to: 'account-details/ira',
    accessibleTo: ['ira', 'investor'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-entity',
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
    icon: 'ns-comments-edit',
    title: 'Referrals',
    to: 'referrals',
    accessibleTo: ['ira', 'individual', 'entity', 'investor'],
  },
  {
    icon: 'gift',
    title: 'Offering',
    to: 'manage/offering',
    accessibleTo: ['bowner'],
    subPanel: 1,
    subNavigations: [
      { title: 'Overview', to: 'overview' },
      { title: 'Offering', to: 'Overview' },
      { title: 'Investors', to: 'investors' },
      { title: 'Comments', to: 'comments' },
      { title: 'Updates', to: 'updates' },
    ],
  },
  {
    icon: 'ns-article',
    title: 'Education',
    to: 'education',
    accessibleTo: ['ira', 'individual', 'entity', 'investor', 'bowner'],
    subPanel: 1,
    subNavigations: [
      { title: 'Welcome Packet', to: 'welcome-packet', component: 'WelcomePacket' },
      { title: 'Knowledge Base', to: 'knowledge-base', component: 'KnowledgeBase' },
      { title: 'FAQ', to: 'faq', component: 'Faq' },
    ],
  },
  {
    icon: 'calendar',
    title: 'Events',
    to: 'manage/events',
    accessibleTo: ['bowner'],
  },
  {
    icon: 'browser',
    title: 'Edgar',
    to: 'edgar',
    accessibleTo: ['admin'],
  },
];
