const INVESTER_ACC_SUB_NAV_ITEMS = {
  subNavigations: [
    { title: 'Portfolio', to: 'portfolio', component: 'Portfolio' },
    { title: 'Transfer Funds', to: 'transfer-funds', component: 'TransferFunds' },
    { title: 'Bank Accounts', to: 'bank-accounts', component: 'BankAccount' },
    { title: 'Transactions', to: 'transactions', component: 'Transactions' },
    { title: 'Statements', to: 'statements', component: 'Statements' },
    { title: 'Settings', to: 'Settings', component: 'Settings' },
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
      {
        title: 'Agreements', to: 'agreements', component: 'Agreements', accessibleTo: ['investor'],
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
    path: {
      issuer: 'issuer/dashboard',
      admin: 'admin/dashboard/Dashboard',
      support: 'admin/dashboard/Dashboard',
      manager: 'admin/dashboard/Dashboard',
    },
    accessibleTo: ['issuer', 'admin', 'manager', 'support'],
    subPanel: 0,
  },
  {
    icon: 'ns-users',
    title: 'Manage Users',
    to: 'users',
    accessibleTo: ['admin', 'manager', 'support'],
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
    path: 'investor/summary',
    accessibleTo: ['investor'],
    subPanel: 0,
  },
  {
    icon: 'ns-article',
    title: 'Application',
    to: 'business-application/:applicationId',
    accessibleTo: ['issuer'],
    subPanel: 0,
    path: 'issuer/businessApplication/containers/BusinessApplication',
    subNavigations: [
      {
        icon: 'ns-check-circle',
        title: 'Pre-qualification',
        to: 'pre-qualification',
        component: 'PreQualification',
        showIcon: true,
      },
      {
        icon: 'ns-check-circle',
        title: 'Business Details',
        to: 'business-details',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED'],
        component: 'BusinessDetails',
        showIcon: true,
      },
      {
        icon: 'ns-check-circle',
        title: 'Performance',
        to: 'performance',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED'],
        component: 'Performance',
        showIcon: true,
      },
      {
        icon: 'ns-check-circle',
        title: 'Documentation',
        to: 'documentation',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED'],
        component: 'Documentation',
        showIcon: true,
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
    accessibleTo: ['issuer'],
    path: 'issuer/offering',
    subPanel: 1,
    subNavigations: [
      { title: 'Overview', to: 'overview', accessFor: [1, 2, 3, 4] },
      {
        title: 'KeyTerms', to: 'key-terms', accessFor: [1], accessibleTo: ['admin', 'manager', 'support'],
      },
      { title: 'Legal', to: 'legal', accessFor: [1] },
      { title: 'Offering', to: 'offering', accessFor: [1] },
      { title: 'Media', to: 'media', accessFor: [1] },
      { title: 'Leadership', to: 'leadership', accessFor: [1] },
      { title: 'Investors', to: 'investors', accessFor: [2, 3, 4] },
      { title: 'Transactions', to: 'transactions', accessFor: [3, 4] },
      { title: 'Comments', to: 'comments', accessFor: [2] },
      { title: 'Updates', to: 'updates', accessFor: [2, 3, 4] },
      {
        title: 'Close', to: 'close', accessFor: [2], accessibleTo: ['admin', 'manager', 'support'],
      },
      { title: 'Bonus Rewards', to: 'bonus-rewards', accessFor: [1, 2, 3, 4] },
      { title: 'Offering Creation', to: 'offering-creation', accessFor: [2] },
    ],
  },
  {
    icon: 'ns-article',
    title: { issuer: 'Resources', investor: 'Education Center' },
    to: 'resources',
    accessibleTo: ['investor', 'issuer'],
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
    accessibleTo: ['issuer'],
  },
  {
    icon: 'legal',
    title: 'Edgar',
    heading: 'Manage Businesses',
    to: 'edgar',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'ns-users',
    title: 'Offerings',
    heading: 'Offerings',
    to: 'offerings',
    path: 'admin/offerings',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 0,
    subNavigations: [
      { title: 'Overview', to: 'overview' },
      { title: 'Creation', to: 'creation' },
      { title: 'Live', to: 'live' },
      { title: 'Engagement', to: 'engagement' },
      { title: 'Completed', to: 'completed' },
    ],
  },
  {
    icon: 'lightbulb outline',
    title: 'Insights',
    to: 'insights',
    path: 'admin/insights',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'question',
    title: 'FAQ',
    to: 'faqs',
    path: 'admin/faqs',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'ns-article',
    title: 'Knowledge Base',
    to: 'knowledge-base',
    path: 'admin/knowledgeBase',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'user secret',
    title: 'Ambassadors',
    to: 'ambassadors',
    path: 'admin/ambassadors',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'handshake outline',
    title: 'Team',
    to: 'team',
    path: 'admin/team',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'wpforms',
    title: 'Applications',
    to: 'applications',
    path: 'admin/applications/containers/ManageApplications',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 1,
    subNavigations: [
      { title: 'Pre-qual failed (2)', to: 'prequal-failed', component: 'ApplicationsList' },
      { title: 'In-Progress (3)', to: 'in-progress', component: 'ApplicationsList' },
      { title: 'Completed (7)', to: 'completed', component: 'ApplicationsList' },
    ],
  },
  {
    icon: 'ns-envelope',
    title: 'Message Center',
    to: 'message-center',
    path: 'admin/messageCenter',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'money',
    title: 'Repayments',
    to: 'repayments',
    path: 'admin/repayments',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'bullhorn',
    title: 'Campaigns',
    to: 'campaigns',
    path: 'admin/campaigns',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'dollar',
    title: 'CrowdPay',
    to: 'crowdPay',
    heading: 'Manage Crowdpay Accounts',
    path: 'admin/crowdPay',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 0,
    subNavigations: [
      { title: 'Review', to: 'review', component: 'ApplicationsList' },
      { title: 'CIP', to: 'cip', component: 'ApplicationsList' },
      { title: 'IRA', to: 'ira', component: 'ApplicationsList' },
      {
        title: 'Entity',
        to: 'entity',
        component: 'ApplicationsList',
      },
    ],
  },
  {
    icon: 'credit card',
    title: 'Transactions',
    to: 'transactions',
    path: 'admin/transactions',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'user plus',
    title: 'Beneficiaries',
    to: 'beneficiaries',
    path: 'admin/beneficiaries',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'payment',
    title: 'Investments',
    to: 'investments',
    path: 'admin/investments',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'history',
    title: 'Activity',
    to: 'activities',
    path: 'admin/activities',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'rocket',
    title: 'Deployments',
    to: 'deployments',
    path: 'admin/deployments',
    accessibleTo: ['admin', 'manager', 'support'],
  },
];

export const PUBLIC_NAV = [
  {
    title: 'About Us',
    to: 'about',
    noNav: true,
    subNavigations: [
      { title: 'Mission', to: 'mission' },
      { title: 'Team', to: 'team' },
      { title: 'Careers', to: 'careers' },
      { title: 'Impact', to: 'impact' },
      { title: 'Press', to: 'press' },
    ],
  },
  {
    title: 'Explore Campaigns',
    to: 'offerings',
    subNavigations: [
      {
        icon: 'ns-home-line', title: 'Overview', to: 'overview', component: 'Overview',
      },
      {
        icon: 'ns-edu-center', title: 'About the Company', to: 'about', component: 'AboutCompany',
      },
      {
        icon: 'ns-investment', title: 'Investment Details', to: 'investment-details', component: 'InvestmentDetails',
      },
      {
        icon: 'ns-rewards', title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards',
      },
      {
        icon: 'ns-document-search', title: 'Disclosures', to: 'disclosures', component: 'Disclosures',
      },
      {
        icon: 'ns-comments-q-a', title: 'Comments', to: 'comments', component: 'Comments',
      },
    ],
  },
  {
    title: 'How NextSeed Works',
    to: 'business',
    noNav: true,
    subNavigations: [
      { title: 'How it Works', to: 'how-it-works' },
      { title: 'Funding Options', to: 'funding-options' },
      { title: 'Process', to: 'process', component: 'InvestmentDetails' },
      { title: 'All-Inclusive', to: 'all-inclusive', component: 'BonusRewards' },
      { title: 'Compare', to: 'compare', component: 'Disclosures' },
    ],
  },
  {
    title: 'Why NextSeed',
    to: 'invest',
    noNav: true,
    subNavigations: [
      { title: 'Why Nextseed', to: 'why-nextseed' },
      { title: 'How it Works', to: 'how-it-works' },
      { title: 'Account Types', to: 'account-types' },
      { title: 'Security', to: 'security' },
      { title: 'Track', to: 'track' },
    ],
  },
  {
    title: 'How NextSeed Works',
    to: '',
    subPanel: 1,
    subNavigations: [
      { title: 'For Investors', to: 'invest' },
      { title: 'For Businesses', to: 'business' },
    ],
  },
];
