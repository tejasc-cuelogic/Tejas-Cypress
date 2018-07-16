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
    path: 'shared/settings/containers/ProfileSettings',
    subNavigations: [
      { title: 'Profile Data', to: 'profile-data', component: 'ProfileData' },
      {
        title: 'Investment limits', to: 'investment-limits', component: 'InvestmentLimits', accessibleTo: ['investor'],
      },
      { title: 'Security', to: 'security', component: 'Security' },
      {
        title: 'Beneficiaries', to: 'beneficiaries', component: 'Beneficiaries', accessibleTo: ['investor'],
      },
    ],
  },
  {
    icon: 'ns-envelope',
    title: 'Messages',
    to: 'messages',
    accessibleTo: [],
    path: 'shared/messages/containers/Messages',
  },
  {
    icon: 'ns-dashboard',
    title: 'Dashboard',
    to: 'dashboard',
    path: { bowner: 'issuer/dashboard', admin: 'admin/dashboard/Dashboard' },
    accessibleTo: ['bowner', 'admin'],
    subPanel: 0,
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
    icon: 'ns-dashboard',
    title: 'Summary',
    to: 'summary',
    path: 'investor/accountSetup/containers/AccountSetup',
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
    path: 'investor/accountDetails/containers/AccountDetails',
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-ira',
    title: 'IRA',
    heading: 'IRA Account',
    to: 'account-details/ira',
    accessibleTo: ['ira'],
    path: 'investor/accountDetails/containers/AccountDetails',
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-entity',
    title: 'Entity',
    heading: 'Entity Account',
    to: 'account-details/entity',
    accessibleTo: ['entity'],
    path: 'investor/accountDetails/containers/AccountDetails',
    subPanel: 1,
    ...INVESTER_ACC_SUB_NAV_ITEMS,
  },
  {
    icon: 'ns-wallet',
    title: 'Rewards wallet',
    to: 'rewards-wallet',
    path: 'investor/rewardsWallet/containers/RewardsWallet',
    accessibleTo: ['ira', 'individual', 'entity'],
  },
  {
    icon: 'ns-comments-edit',
    title: 'Referrals',
    to: 'referrals',
    path: 'investor/referrals/containers/Referrals',
    accessibleTo: ['ira', 'individual', 'entity'],
  },
  {
    icon: 'gift',
    title: 'Offering',
    to: 'offering/:id',
    accessibleTo: ['bowner'],
    path: 'issuer/offering',
    subPanel: 1,
    subNavigations: [
      { title: 'Overview', to: 'overview', accessFor: [1, 2, 3, 4] },
      { title: 'Marketing', to: 'marketing', accessFor: [1] },
      { title: 'Investors', to: 'investors', accessFor: [2, 3, 4] },
      { title: 'Comments', to: 'comments', accessFor: [2] },
      { title: 'Disclosure', to: 'disclosure', accessFor: [1] },
      { title: 'Updates', to: 'updates', accessFor: [2, 4] },
      { title: 'Bonus Rewards Creation', to: 'bonus-rewards-creation', accessFor: [1] },
      { title: 'Leadership', to: 'leadership', accessFor: [1] },
      { title: 'Bonus Rewards Redemption', to: 'bonus-rewards-redemption', accessFor: [4] },
      { title: 'Payments', to: 'payments', accessFor: [4] },
      { title: 'Documents', to: 'documents', accessFor: [3, 4] },
    ],
  },
  {
    icon: 'ns-article',
    title: { bowner: 'Resources', investor: 'Education Centre' },
    to: 'resources',
    accessibleTo: ['investor', 'bowner'],
    subPanel: 1,
    path: 'shared/education/containers/Education',
    subNavigations: [
      { title: 'Welcome Packet', to: 'welcome-packet', component: 'WelcomePacket' },
      { title: 'Knowledge Base', to: 'knowledge-base', component: 'KnowledgeBase' },
      { title: 'FAQ', to: 'faq', component: 'Faq' },
    ],
  },
  {
    icon: 'calendar',
    title: 'Events',
    to: 'events',
    path: 'issuer/events',
    accessibleTo: ['bowner'],
  },
  {
    icon: 'legal',
    title: 'Edgar',
    heading: 'Manage Businesses',
    to: 'edgar',
    accessibleTo: ['admin'],
  },
  {
    icon: 'lightbulb outline',
    title: 'Insights',
    to: 'insights',
    path: 'admin/insights',
    accessibleTo: ['admin'],
  },
  {
    icon: 'question',
    title: 'FAQ',
    to: 'faqs',
    path: 'admin/faqs',
    accessibleTo: ['admin'],
  },
  {
    icon: 'ns-article',
    title: 'Knowledge Base',
    to: 'knowledge-base',
    path: 'admin/knowledgeBase',
    accessibleTo: ['admin'],
  },
  {
    icon: 'user secret',
    title: 'Ambassadors',
    to: 'ambassadors',
    path: 'admin/ambassadors',
    accessibleTo: ['admin'],
  },
  {
    icon: 'handshake outline',
    title: 'Team',
    to: 'team',
    path: 'admin/team',
    accessibleTo: ['admin'],
  },
  {
    icon: 'wpforms',
    title: 'Applications',
    to: 'applications',
    path: 'admin/applications',
    accessibleTo: ['admin'],
  },
  {
    icon: 'ns-envelope',
    title: 'Message Center',
    to: 'message-center',
    path: 'admin/messageCenter',
    accessibleTo: ['admin'],
  },
  {
    icon: 'money',
    title: 'Repayments',
    to: 'repayments',
    path: 'admin/repayments',
    accessibleTo: ['admin'],
  },
  {
    icon: 'bullhorn',
    title: 'Campaigns',
    to: 'campaigns',
    path: 'admin/campaigns',
    accessibleTo: ['admin'],
  },
  {
    icon: 'dollar',
    title: 'CrowdPay',
    to: 'crowdPay',
    path: 'admin/crowdPay',
    accessibleTo: ['admin'],
  },
  {
    icon: 'credit card',
    title: 'Transactions',
    to: 'transactions',
    path: 'admin/transactions',
    accessibleTo: ['admin'],
  },
  {
    icon: 'user plus',
    title: 'Beneficiaries',
    to: 'beneficiaries',
    path: 'admin/beneficiaries',
    accessibleTo: ['admin'],
  },
  {
    icon: 'payment',
    title: 'Investments',
    to: 'investments',
    path: 'admin/investments',
    accessibleTo: ['admin'],
  },
  {
    icon: 'history',
    title: 'Activity',
    to: 'activities',
    path: 'admin/activities',
    accessibleTo: ['admin'],
  },
  {
    icon: 'rocket',
    title: 'Deployments',
    to: 'deployments',
    path: 'admin/deployments',
    accessibleTo: ['admin'],
  },
];

export const PUBLIC_NAV = [
  { title: 'Explore Campaigns', to: 'offerings' },
  { title: 'How NextSeed Works', to: 'business' },
];
