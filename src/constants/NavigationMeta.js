const INVESTER_ACC_SUB_NAV_ITEMS = {
  subNavigations: [
    { title: 'Portfolio', to: 'portfolio', component: 'Portfolio' },
    { title: 'Transfer Funds', to: 'transfer-funds', component: 'TransferFunds' },
    { title: 'Bank Accounts', to: 'bank-accounts', component: 'BankAccount' },
    { title: 'Transactions', to: 'transactions', component: 'Transactions' },
    { title: 'Statements', to: 'statements', component: 'Statements' },
    // { title: 'Settings', to: 'Settings', component: 'Settings' },
  ],
};


const INDIVIDUAL_ACC = {
  icon: 'ns-individual',
  title: 'Individual',
  heading: 'Individual Account',
  to: 'account-details/individual',
  accessibleTo: ['individual'],
  path: 'investor/accountDetails/containers/AccountDetails',
  hideSubOnSideBar: true,
  subPanel: 1,
  ...INVESTER_ACC_SUB_NAV_ITEMS,
};

const IRA_ACC = {
  icon: 'ns-ira',
  title: 'IRA',
  heading: 'IRA Account',
  to: 'account-details/ira',
  accessibleTo: ['ira'],
  path: 'investor/accountDetails/containers/AccountDetails',
  hideSubOnSideBar: true,
  subPanel: 1,
  ...INVESTER_ACC_SUB_NAV_ITEMS,
};

const ENTITY_ACC = {
  icon: 'ns-entity',
  title: 'Entity',
  heading: 'Entity Account',
  to: 'account-details/entity',
  accessibleTo: ['entity'],
  path: 'investor/accountDetails/containers/AccountDetails',
  hideSubOnSideBar: true,
  subPanel: 1,
  ...INVESTER_ACC_SUB_NAV_ITEMS,
};
const NEW_OFFERING_LAYOUT = [
  {
    component: 'CampaignLayout', title: 'Highlights', to: '#top-things-to-know', useRefLink: true, defaultActive: true, key: 'hasTopThingToKnow',
  },
  {
    title: 'Updates', to: '#updates', useRefLink: true, key: 'updates',
  },
  {
    title: 'Investment Terms', to: '#key-terms', useRefLink: true, key: 'keyTerms',
  },
  {
    title: 'Use of Proceeds', to: '#use-of-proceeds', useRefLink: true, key: 'useOfProcceds',
  },
  {
    title: 'Company Description', to: '#company-description', useRefLink: true, key: 'companyDescription',
  },
  {
    title: 'Business Model', to: '#business-model', useRefLink: true, key: 'businessModel',
  },
  {
    title: 'Location Analysis', to: '#location-analysis', useRefLink: true, key: 'localAnalysis',
  },
  {
    title: 'History', to: '#history', useRefLink: true, key: 'history',
  },
  {
    title: 'The Team', to: '#team', useRefLink: true, key: 'team',
  },
  {
    title: 'Bonus Rewards', to: '#bonus-rewards', useRefLink: true, key: 'isBonusReward',
  },
  {
    title: 'Gallery', to: '#gallery', useRefLink: true, key: 'gallery',
  },
  {
    title: 'Documents', to: '#data-room', useRefLink: true, key: 'dataRooms',
  },
  {
    title: 'Revenue Sharing Summary', to: '#revenue-sharing-summary', useRefLink: true, key: 'isRevenueShare',
  },
  {
    title: 'Total Payment Calculator', to: '#total-payment-calculator', useRefLink: true, key: 'isTermNote1',
  },
  {
    title: 'Comments', to: '#comments', useRefLink: true,
  },
];

/*
subPanel => 0: none, 1: subnavigation, 2: has search panel
*/

export const PRIVATE_NAV = [
  // {
  //   icon: 'ns-envelope',
  //   title: 'Messages',
  //   to: 'messages',
  //   accessibleTo: [],
  //   path: 'shared/messages/containers/Messages',
  // },
  {
    icon: 'ns-dashboard',
    title: 'Dashboard',
    to: 'dashboard',
    path: {
      issuer: 'issuer/dashboard',
      admin: 'admin/dashboard/Dashboard',
    },
    accessibleTo: ['issuer', 'admin'],
    asRoot: true,
    exact: true,
    subPanel: 0,
  },
  {
    icon: 'ns-users',
    title: 'Manage Users',
    capability: 'USERS_ANY',
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
    title: 'Application',
    to: 'application',
    noNav: true,
    path: 'issuer/dashboard/init',
    accessibleTo: ['issuer'],
    subPanel: 0,
  },
  {
    title: 'Accounts',
    accessibleTo: ['investor'],
    to: 'setup',
    path: 'investor/setup',
    isMenuHeader: true,
    subPanel: 0,
  },
  {
    icon: 'ns-dashboard',
    title: 'Setup',
    to: 'setup',
    path: 'investor/setup',
    accessibleTo: ['investor'],
    subPanel: 0,
  },
  {
    icon: 'ns-article',
    title: 'Application',
    to: 'business-application/:applicationType/:applicationId',
    accessibleTo: ['issuer'],
    subPanel: 0,
    path: 'issuer/businessApplication/containers/BusinessApplication',
    subNavigations: [
      {
        icon: { COMPLETE: 'ns-check-circle', IN_PROGRESS: 'ns-warning-circle' },
        icon_color: { COMPLETE: 'green', IN_PROGRESS: 'orange' },
        title: 'Pre-qualification',
        to: 'pre-qualification',
        component: 'PreQualification',
        showIcon: true,
      },
      {
        icon: { COMPLETE: 'ns-check-circle', IN_PROGRESS: 'ns-warning-circle' },
        icon_color: { COMPLETE: 'green', IN_PROGRESS: 'orange' },
        title: 'Business Details',
        to: 'business-details',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED', 'APPLICATION_SUCCESSFUL', 'APPLICATION_OFFERED'],
        component: 'BusinessDetails',
        showIcon: true,
        toolTipTitle: 'This section is not complete, please fill out all the * fields.',
      },
      {
        icon: { COMPLETE: 'ns-check-circle', IN_PROGRESS: 'ns-warning-circle' },
        icon_color: { COMPLETE: 'green', IN_PROGRESS: 'orange' },
        title: 'Performance',
        to: 'performance',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED', 'APPLICATION_SUCCESSFUL', 'APPLICATION_OFFERED'],
        component: 'Performance',
        showIcon: true,
        toolTipTitle: 'This section is not complete, please fill out all the * fields.',
      },
      {
        icon: { COMPLETE: 'ns-check-circle', IN_PROGRESS: 'ns-warning-circle' },
        icon_color: { COMPLETE: 'green', IN_PROGRESS: 'orange' },
        title: 'Documentation',
        to: 'documentation',
        accessFor: ['PRE_QUALIFICATION_SUBMITTED', 'APPLICATION_SUBMITTED', 'APPLICATION_SUCCESSFUL', 'APPLICATION_OFFERED'],
        component: 'Documentation',
        showIcon: true,
        toolTipTitle: 'This section is not complete, please fill out all the * fields.',
      },
    ],
  },
  { ...INDIVIDUAL_ACC },
  { ...IRA_ACC },
  { ...ENTITY_ACC },
  // {
  //   icon: 'ns-wallet',
  //   title: 'Rewards wallet',
  //   to: 'rewards-wallet',
  //   path: 'investor/rewardsWallet/containers/RewardsWallet',
  //   accessibleTo: ['ira', 'individual', 'entity'],
  // },
  {
    title: 'Account Settings',
    icon: 'ns-setting',
    to: 'account-settings',
    heading: 'Account Settings',
    hideSubOnSideBar: true,
    subPanel: 1,
    accessibleTo: [],
    path: 'shared/settings/containers/ProfileSettings',
    subNavigations: [
      { title: 'Profile Data', to: 'profile-data', component: 'ProfileData' },
      {
        title: 'Investment limits', to: 'investment-limits', component: 'InvestmentLimits', accessibleTo: ['investor'],
      },
      { title: 'Security', to: 'security', component: 'Security' },
      // {
      //   title: 'Beneficiaries',
      //   to: 'beneficiaries',
      //   component: 'Beneficiaries',
      //   accessibleTo: ['investor'],
      // },
      {
        title: 'Agreements', to: 'agreements', component: 'Agreements', accessibleTo: ['investor'],
      },
    ],
  },
  {
    icon: 'ns-comments-edit',
    title: 'Referrals',
    to: 'referrals',
    path: 'investor/referrals/containers/Referrals',
    accessibleTo: ['ira', 'individual', 'entity'],
    // accessibleTo: ['investor'],
  },
  {
    icon: 'gift',
    title: 'Offering',
    to: 'offering/:offeringSlug',
    path: {
      issuer: 'issuer/offering',
      admin: 'admin/offerings/containers/OfferingDetails',
    },
    accessibleTo: ['issuer', 'admin'],
    subPanel: 1,
    subNavigations: [
      { title: 'Overview', to: 'overview', accessFor: [1, 2, 3, 4], accessibleTo: ['admin', 'manager', 'support'] },
      { title: 'Marketing', to: 'marketing', accessFor: [1, 2, 3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 2 },
      {
        title: 'Key Terms', to: 'key-terms', accessFor: [1], accessibleTo: ['admin', 'manager', 'support'], template: 1,
      },
      { title: 'Legal', to: 'legal', accessFor: [1], accessibleTo: ['admin', 'manager', 'support'], template: 1 },
      { title: 'Legal', to: 'legal', accessFor: [1, 2, 3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 2 },
      { title: 'Offering', to: 'offering', accessFor: [1], accessibleTo: ['admin', 'manager', 'support'], template: 1 },
      { title: 'Offering', to: 'offering', accessFor: [1, 2, 3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 2 },
      { title: 'Media', to: 'media', accessFor: [1], template: 1 },
      { title: 'Leadership', to: 'leadership', accessFor: [1], template: 1 },
      { title: 'Investors', to: 'investors', accessFor: [2, 3, 4] },
      {
        title: 'Transactions', to: 'transactions', accessFor: [3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 1, env: ['localhost', 'predev', 'dev'],
      },
      { title: 'Comments', to: 'comments', accessFor: [2, 3] },
      { title: 'Updates', to: 'updates', accessFor: [2, 3, 4] },
      {
        title: 'Close', to: 'close', accessFor: [2, 3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 1,
      },
      { title: 'Bonus Rewards', to: 'bonus-rewards', accessFor: [1, 2, 3, 4], template: 1 },
      { title: 'Documents', to: 'documents', accessFor: [2, 3, 4], accessibleTo: ['issuer'], filterKey: 'closingBinder', template: 1 },
      {
        title: 'Offering Creation', to: 'offering-creation', accessFor: [2, 3, 4], accessibleTo: ['admin', 'manager', 'support'], template: 1,
      },
      {
        title: 'Watch List', to: 'watch-list', accessFor: [2, 3, 4], accessibleTo: ['admin', 'manager', 'support'],
      },
      {
        title: 'Activity History', to: 'activity-history', accessFor: [1, 2, 3, 4], accessibleTo: ['admin', 'manager', 'support'],
      },
    ],
  },
  // {
  //   icon: 'ns-article',
  //   title: { issuer: 'Resources', investor: 'Education Center' },
  //   hideSubOnSideBar: true,
  //   to: 'resources',
  //   accessibleTo: ['investor', 'issuer'],
  //   subPanel: 1,
  //   path: 'shared/education/containers/Education',
  //   subNavigations: [
  //     {
  //       title: 'Welcome Packet', to: 'welcome-packet', component: 'WelcomePacket', accessibleTo: ['investor'],
  //     },
  //     { title: 'Knowledge Base', to: 'knowledge-base', component: 'KnowledgeBase' },
  //     {
  //       title: 'FAQ', to: 'faq', component: 'Faq', env: ['localhost', 'dev'],
  //     },
  //   ],
  // },
  // {
  //   icon: 'calendar',
  //   title: 'Events',
  //   to: 'events',
  //   path: 'issuer/events',
  //   accessibleTo: ['issuer'],
  // },
  {
    icon: 'legal',
    title: 'Edgar',
    heading: 'Manage Businesses',
    to: 'edgar',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'bullhorn',
    title: 'Offerings',
    capability: 'OFFERINGS_ANY',
    heading: 'Offerings',
    to: 'offerings',
    path: 'admin/offerings',
    accessibleTo: ['admin'],
    subPanel: 0,
    subNavigations: [
      { title: 'Overview', to: 'overview', env: ['localhost', 'dev'] },
      { title: 'Creation', to: 'creation' },
      { title: 'Live', to: 'live' },
      { title: 'ᕕ( ᐛ )ᕗ', to: 'completed' },
      // { title: 'Engagement', to: 'engagement' },
      // { title: 'Completed', to: 'completed' },
      { title: '¯\\_(ツ)_/¯', to: 'failed' },
    ],
  },
  {
    icon: 'list layout',
    title: 'Content',
    capability: 'CONTENT_ANY',
    to: 'content',
    path: 'admin/content',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 1,
    subNavigations: [
      {
        title: 'Categories', to: 'categories', component: 'categories', capability: 'CATEGORIES_ANY',
      },
      {
        title: 'Faqs', to: 'faqs', component: 'faqs', capability: 'FAQ_ANY',
      },
      {
        title: 'Knowledge Base', to: 'knowledgeBase', component: 'knowledgeBase', capability: 'KNOWLEDGE_BASE_ANY',
      },
      {
        title: 'Insights', to: 'insights', component: 'insights', capability: 'INSIGHTS_ANY',
      },
      {
        title: 'Team', to: 'team', component: 'team', capability: 'TEAM_ANY',
      },
    ],
  },
  // {
  //   icon: 'list layout',
  //   title: 'Categories',
  //   capability: 'CATEGORIES_ANY',
  //   to: 'categories',
  //   path: 'admin/categories',
  //   accessibleTo: ['admin', 'manager', 'support'],
  // },
  // {
  //   icon: 'lightbulb outline',
  //   title: 'Insights',
  //   capability: 'INSIGHTS_ANY',
  //   to: 'insights',
  //   path: 'admin/insights',
  //   accessibleTo: ['admin', 'manager', 'support'],
  // },
  // {
  //   icon: 'question',
  //   title: 'FAQ',
  //   capability: 'FAQ_ANY',
  //   to: 'faqs',
  //   path: 'admin/faqs',
  //   accessibleTo: ['admin', 'manager', 'support'],
  // },
  // {
  //   icon: 'ns-article',
  //   title: 'Knowledge Base',
  //   capability: 'KNOWLEDGE_BASE_ANY',
  //   to: 'knowledge-base',
  //   path: 'admin/knowledgeBase',
  //   accessibleTo: ['admin', 'manager', 'support'],
  // },
  {
    icon: 'user secret',
    title: 'Ambassadors',
    capability: 'AMBASSADORS_ANY',
    to: 'ambassadors',
    path: 'admin/ambassadors',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  // {
  //   icon: 'handshake outline',
  //   title: 'Team',
  //   capability: 'TEAM_ANY',
  //   to: 'team',
  //   path: 'admin/team',
  //   accessibleTo: ['admin', 'manager', 'support'],
  // },
  {
    icon: 'wpforms',
    title: 'Applications',
    capability: 'APPLICATIONS_ANY',
    to: 'applications',
    path: 'admin/applications/containers/ManageApplications',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 0,
    subNavigations: [
      { title: 'Pre-qual failed', to: 'prequal-failed', component: 'ApplicationsList' },
      { title: 'In-Progress', to: 'in-progress', component: 'ApplicationsList' },
      { title: 'Completed', to: 'completed', component: 'ApplicationsList' },
    ],
  },
  {
    icon: 'ns-envelope',
    title: 'Message Center',
    capability: 'MESSAGE_CENTER_ANY',
    to: 'message-center',
    path: 'admin/messageCenter',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'money',
    title: 'Payments',
    capability: 'REPAYMENTS_ANY',
    to: 'payments',
    path: 'admin/repayments',
    accessibleTo: ['admin', 'manager', 'support'],
    subNavigations: [
      { title: 'Tracker', to: 'tracker' },
      { title: 'Issuers', to: 'issuers' },
      { title: 'Batches', to: 'batches' },
      { title: 'Util', to: 'util' },
    ],
  },
  {
    icon: 'dollar',
    title: 'CrowdPay',
    capability: 'CROWD_PAY_ANY',
    to: 'crowdpay',
    heading: 'Manage Crowdpay Accounts',
    path: 'admin/crowdPay',
    accessibleTo: ['admin'],
    subPanel: 0,
    subNavigations: [
      { title: 'Review', to: 'review', component: 'ApplicationsList' },
      { title: 'Individual', to: 'individual', component: 'ApplicationsList' },
      { title: 'IRA', to: 'ira', component: 'ApplicationsList' },
      {
        title: 'Entity',
        to: 'entity',
        component: 'ApplicationsList',
      },
    ],
  },
  {
    icon: 'university',
    title: 'Linked Bank Request',
    capability: 'LINKED_BANK_ANY',
    to: 'change-linked-bank-requests',
    heading: 'Linked Bank Request',
    path: 'admin/linkedBank',
    accessibleTo: ['admin'],
  },
  {
    icon: 'credit card',
    title: 'Transfer Requests',
    capability: 'TRANSACTIONS_ANY',
    to: 'transfer-requests',
    path: 'admin/transfer-requests',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 0,
    subNavigations: [
      // { title: 'Pre-pending', to: 'pre-pending', component: 'AllTransactions' },
      { title: 'Pending', to: 'pending', component: 'AllTransactions' },
      { title: 'Processing', to: 'processing', component: 'AllTransactions' },
      { title: 'Complete', to: 'complete', component: 'AllTransactions' },
      { title: 'Failed', to: 'failed', component: 'AllTransactions' },
    ],
  },
  {
    icon: 'user plus',
    title: 'Beneficiaries',
    capability: 'BENEFICIARIES_ANY',
    to: 'beneficiaries',
    path: 'admin/beneficiaries',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'payment',
    title: 'Investments',
    capability: 'INVESTMENTS_ANY',
    to: 'investments',
    path: 'admin/investments',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'history',
    title: 'Activity',
    capability: 'ACTIVITIES_ANY',
    to: 'activities',
    path: 'admin/activities',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'rocket',
    title: 'Deployments',
    capability: 'DEPLOYMENTS_ANY',
    to: 'deployments',
    path: 'admin/deployments',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'payment',
    title: 'Accredited Status',
    heading: 'Accredited Status Request',
    capability: 'ACCREDITATION_ANY',
    to: 'accreditation',
    path: 'admin/accreditation',
    accessibleTo: ['admin', 'manager', 'support'],
  },
  {
    icon: 'ns-setting',
    title: 'Dev',
    capability: 'DEV_ANY',
    to: 'dev',
    path: 'admin/dev',
    accessibleTo: ['admin', 'manager', 'support'],
    subPanel: 1,
    subNavigations: [
      {
        title: 'Elasticsearch', to: 'elasticsearch', component: 'ElasticSearch', capability: 'ELASTICSEARCH_ANY',
      },
      {
        title: 'Data', to: 'data', component: 'Data', capability: 'DATA_ANY',
      },
      {
        title: 'Cron Factory', to: 'factory', component: 'Factory', capability: 'FACTORY_ANY',
      },
      {
        title: 'Request Factory', to: 'request-factory', component: 'RequestFactory', capability: 'REQUEST_FACTORY_ANY',
      },
      {
        title: 'Process Factory', to: 'process-factory', component: 'ProcessFactory', capability: 'PROCESS_FACTORY_ANY',
      },
      {
        title: 'File Factory', to: 'file-factory', component: 'FileFactory', capability: 'FILE_FACTORY_ANY',
      },
      {
        title: 'Email', to: 'email', component: 'Email', capability: 'EMAIL_ANY',
      },
    ],
  },
];

export const PUBLIC_NAV = [
  {
    title: 'Home',
    to: '',
    exact: true,
    header: false,
  },
  {
    title: 'About Us',
    to: 'about',
    noNav: true,
    subNavigations: [
      { title: 'Mission', to: 'mission' },
      { title: 'Team', to: 'team' },
      { title: 'Careers', to: 'careers' },
      // { title: 'Impact', to: 'impact' },
      // { title: 'Press', to: 'press' },
    ],
  },
  {
    title: 'Investment opportunities',
    to: 'offerings-v2/',
    header: false,
    headerMobile: false,
    subNavigations: NEW_OFFERING_LAYOUT,
  },
  {
    title: 'Investment opportunities',
    to: 'offerings/',
    subNavigations: NEW_OFFERING_LAYOUT,
  },
  {
    title: 'Investment opportunities',
    to: 'offerings-v1',
    header: false,
    headerMobile: false,
    subNavigations: [
      {
        defaultOpen: true,
        title: 'Summary',
        to: 'overview',
        component: 'Overview',
        subPanel: 1,
        clickable: true,
        subNavigations: [
          {
            title: 'Top Things to Know', to: '#top-things-to-know', useRefLink: true, defaultActive: true, key: 'hasTopThingToKnow',
          },
          {
            title: 'Investment Highlights', to: '#investment-highlights', useRefLink: true, key: 'investmentHighlights',
          },
          {
            title: 'Updates', to: '#updates', useRefLink: true, key: 'updates',
          },
          {
            title: 'Gallery', to: '#gallery', useRefLink: true, key: 'gallery',
          },
          {
            title: 'Issuer Statement', to: '#issuer-statement', useRefLink: true, key: 'issuerStatement',
          },
        ],
      },
      {
        title: 'About the Company',
        to: 'about',
        component: 'AboutCompany',
        subPanel: 1,
        clickable: true,
        subNavigations: [
          {
            title: 'Overview', to: '#company-description', useRefLink: true, defaultActive: true, key: 'companyDescription',
          },
          {
            title: 'Business Model', to: '#business-model', useRefLink: true, key: 'businessModel',
          },
          {
            title: 'Location Analysis', to: '#location-analysis', useRefLink: true, key: 'localAnalysis',
          },
          {
            title: 'History', to: '#history', useRefLink: true, key: 'history',
          },
          {
            title: 'Team', to: '#team', useRefLink: true, key: 'team',
          },
        ],
      },
      {
        title: 'Investment Details',
        to: 'investment-details',
        component: 'InvestmentDetails',
        subPanel: 1,
        clickable: true,
        subNavigations: [
          {
            title: 'Use of Proceeds', to: '#use-of-proceeds', useRefLink: true, defaultActive: true, key: 'useOfProcceds',
          },
          {
            title: 'Key Terms', to: '#key-terms', useRefLink: true,
          },
          // {
          //   title: 'Revenue Sharing Summary', to: '#revenue-sharing-summary', useRefLink: true,
          // },
          // {
          //   title: 'Total Payment Calculator', to: '#total-payment-calculator', useRefLink: true,
          // },
        ],
      },
      {
        clickable: true, title: 'Bonus Rewards', to: 'bonus-rewards', component: 'BonusRewards',
      },
      {
        clickable: true, title: 'Data Room', to: 'data-room', component: 'Disclosures',
      },
      {
        clickable: true, title: 'Updates', to: 'updates', component: 'Updates',
      },
      {
        clickable: true, title: 'Comments', to: 'comments', component: 'Comments',
      },
    ],
  },
  {
    title: 'How It Works',
    to: '',
    subPanel: 1,
    exact: true,
    subNavigations: [
      { title: 'For Investors', to: 'investors' },
      { title: 'For Businesses', to: 'business' },
      { title: 'Education Center', to: 'education-center' },
    ],
  },
  {
    title: 'About us',
    to: '',
    subPanel: 1,
    exact: true,
    subNavigations: [
      { title: 'Who We Are', to: 'about' },
      // { title: 'Team & Culture', to: 'about/team' },
      // { title: 'Careers', to: 'about/careers' },
      { title: 'Insights', to: 'insights' },
      { title: 'NextSeed Space', to: 'space' },
      { title: 'The NextSeed Group', to: 'group' },
    ],
  },
  // {
  //   title: 'My Account',
  //   to: '',
  //   subPanel: 1,
  //   exact: true,
  //   subNavigations: [
  //     { title: 'Portfolio', to: 'app/setup' },
  //     { title: 'Settings', to: 'app/account-settings' },
  //     { title: 'Refer a Friend', to: 'app/referrals' },
  //     { title: 'Log out', to: '' },
  //     // { title: 'Press', to: 'press' },
  //   ],
  // },
  {
    title: 'Legal',
    to: 'legal',
    exact: true,
    subPanel: 1,
    subNavigations: [
      { title: 'Terms of Use', to: 'terms-of-use' },
      { title: 'Privacy Policy', to: 'privacy-policy' },
      { title: 'General Disclosures', to: 'general-disclosures' },
      { title: 'General Risk Factors', to: 'general-risk-factors' },
      { title: 'Legal Documents', to: 'legal-documents' },
    ],
  },
];

export const MOBILE_NAV = [
  {
    title: INDIVIDUAL_ACC.title,
    to: `app/${INDIVIDUAL_ACC.to}/portfolio`,
    accessibleTo: INDIVIDUAL_ACC.accessibleTo,
    isLoggedIn: true,
  },
  {
    title: IRA_ACC.title,
    to: `app/${IRA_ACC.to}/portfolio`,
    accessibleTo: IRA_ACC.accessibleTo,
    isLoggedIn: true,
  },
  {
    title: ENTITY_ACC.title,
    to: `app/${ENTITY_ACC.to}/portfolio`,
    accessibleTo: ENTITY_ACC.accessibleTo,
    isLoggedIn: true,
  },
  { title: 'Investment Opportunities', to: 'offerings', isLoggedIn: true },
  {
    title: 'Refer a Friend',
    to: 'app/referrals',
    accessibleTo: ['ira', 'individual', 'entity'],
    isLoggedIn: true,
  },
  { title: 'Settings', to: 'app/account-settings', isLoggedIn: true },
  { title: 'Add New Account', to: 'app/setup/account-creation', isLoggedIn: true },
  { title: 'For Investors', to: 'investors' },
  { title: 'For Businesses', to: 'business' },
  { title: 'Education Center', to: 'education-center' },
  { title: 'Who We Are', to: 'about' },
  { title: 'Insights', to: 'insights' },
  { title: 'NextSeed Space', to: 'space' },
];

export const FOOTER_NAV = [
  // {
  //   title: 'Resources',
  //   to: 'resources',
  //   subPanel: 1,
  //   subNavigations: [
  //     { title: 'Ed Center', to: 'education-center' },
  //     { title: 'Insights', to: 'insights' },
  //   ],
  // },
  // {
  //   title: 'About Us',
  //   to: 'about',
  //   exact: true,
  //   subPanel: 1,
  //   subNavigations: [
  //     { title: 'Mission', to: 'mission' },
  //     { title: 'Team & Culture', to: 'team' },
  //     { title: 'Careers', to: 'careers' },
  //     { title: 'Press', to: 'press' },
  //   ],
  // },
  // {
  //   title: 'Legal',
  //   to: 'agreements/legal',
  //   exact: true,
  //   subPanel: 1,
  //   subNavigations: [
  //     { title: 'Terms of Use', to: 'terms-of-use' },
  //     { title: 'Privacy Policy', to: 'privacy-policy' },
  //     { title: 'General Disclosures', to: 'general-disclosures' },
  //     { title: 'General Risk Factors', to: 'general-risk-factors' },
  //     { title: 'Legal Documents', to: 'legal-documents' },
  //   ],
  // },
];

export const CIP_ROUTES = [
  {
    path: 'cip',
    component: 'Cip',
  },
  {
    path: 'cip/uploads',
    component: 'CipHardFail',
  },
  {
    path: 'cip/questions',
    component: 'CipSoftFail',
  },
  {
    path: 'cip/address-verification',
    component: 'CipAddressVerification',
  },
  {
    path: 'cip/phone-verification',
    component: 'CipPhoneVerification',
  },
];
