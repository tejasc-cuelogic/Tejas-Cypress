import { COMMON_NAV_ITEMS } from './common';

export const ADMIN_NAV_ITEMS = [
  ...[COMMON_NAV_ITEMS[1]],
  {
    icon: 'ns-users',
    title: 'Manage users',
    to: 'users',
    accessibleTo: ['admin'],
    subNavigations: [
      {
        title: 'Profile',
        to: 'profile',
      },
      {
        title: 'Limits',
        to: 'limits',
      },
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
];