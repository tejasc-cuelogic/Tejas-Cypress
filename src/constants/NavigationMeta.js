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

export const PRIVATE_NAV = [
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
    title: 'Manage Users',
    to: 'users',
    accessibleTo: ['admin'],
    subNavigations: [
      { title: 'Profile', to: 'profile', component: 'Detail' },
      { title: 'Limits', to: 'limits', component: 'Limits' },
      { title: 'Beneficiaries', to: 'beneficiaries', component: 'Beneficiaries' },
      { title: 'Portfolio', to: 'portfolio', component: 'Portfolio' },
      { title: 'Transactions', to: 'transactions', component: 'Transactions' },
      { title: 'Statements', to: 'statements', component: 'Statements' },
      { title: 'Bonus rewards', to: 'bonus-rewards', component: 'BonusRewards' },
      { title: 'Messages', to: 'talk', component: 'Messages' },
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
    accessibleTo: ['investor'],
    subPanel: 0,
  },
  {
    icon: 'ns-article',
    title: 'Application',
    to: 'business-application',
    accessibleTo: ['bowner'],
    subPanel: 1,
    subNavigations: [
      {
        icon: 'ns-check-circle',
        title: 'Pre-qualification',
        to: 'pre-qualification',
        component: 'PreQualification',
      },
      {
        icon: 'ns-check-circle',
        title: 'Business Details',
        to: 'business-details',
        component: 'BusinessDetails',
      },
      {
        icon: 'ns-check-circle',
        title: 'Performance',
        to: 'performance',
        component: 'Performance',
      },
      {
        icon: 'ns-check-circle',
        title: 'Documentation',
        to: 'documentation',
        component: 'Documentation',
      },
    ],
  },
  {
    icon: 'ns-individual',
    title: 'Individual',
    heading: 'Individual Account',
    to: 'account-details/individual',
    accessibleTo: ['individual'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-ira',
    title: 'IRA',
    heading: 'IRA Account',
    to: 'account-details/ira',
    accessibleTo: ['ira'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-entity',
    title: 'Entity',
    heading: 'Entity Account',
    to: 'account-details/entity',
    accessibleTo: ['entity'],
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-wallet',
    title: 'Rewards wallet',
    to: 'rewards-wallet',
    accessibleTo: ['ira', 'individual', 'entity'],
  },
  {
    icon: 'ns-comments-edit',
    title: 'Referrals',
    to: 'referrals',
    accessibleTo: ['ira', 'individual', 'entity'],
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
    title: 'Resources',
    to: 'resources',
    accessibleTo: ['investor', 'bowner'],
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
    heading: 'Manage Businesses',
    to: 'edgar',
    accessibleTo: ['admin'],
  },
];

export const PUBLIC_NAV = [
  { title: 'Browse Deals', to: 'offerings' },
  { title: 'For Investers', to: 'invest' },
  { title: 'For Businesses', to: 'business' },
  {
    title: 'Learn',
    subPanel: 1,
    to: '',
    subNavigations: [
      { title: 'Team', to: 'about/team' },
      { title: 'Ambassadors', to: 'about/ambassadors' },
      { title: 'Blog', to: 'blog' },
      { title: 'Case Studies', to: 'case-studies' },
      { title: 'FAQ', to: 'about/faq' },
    ],
  },
  {
    title: 'Log In or Sign Up',
    subPanel: 1,
    to: 'auth',
    subNavigations: [
      { title: 'Log In', to: 'login' },
      { title: 'Register', to: 'register' },
    ],
  },
  { title: 'Dashboard', to: 'app/dashboard' },
];
