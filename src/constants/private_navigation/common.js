export const COMMON_NAV_ITEMS = [
  {
    title: 'Settings',
    to: 'settings',
    heading: 'Profile Settings',
    subPanel: 1,
    accessibleTo: [],
    subNavigations: [
      {
        title: 'Profile Data',
        to: 'profile-data',
      },
      {
        title: 'Investment limits',
        to: 'investment-limits',
      },
      {
        title: 'Security',
        to: 'security',
      },
      {
        title: 'Beneficiaries',
        to: 'beneficiaries',
      },
    ],
  },
  {
    icon: 'ns-envelope',
    title: 'Messages',
    to: 'messages',
    accessibleTo: [],
  },
];