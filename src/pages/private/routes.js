import Admin from './admin/Admin';
import UsersList from './admin/UsersList';
import Business from './business/Business';
import Investor from './investor/Investor';
import Settings from './settings/Settings';

import {
  AdminAuthorization,
  BusinessAuthorization,
  InvestorAuthorization,
} from './../../components/common/Authorization';

export default [
  {
    path: '/admin',
    component: Admin,
    auth: AdminAuthorization,
  },
  {
    path: '/admin/users-list',
    component: UsersList,
    auth: AdminAuthorization,
  },
  {
    path: '/business',
    component: Business,
    auth: BusinessAuthorization,
  },
  {
    path: '/investor',
    component: Investor,
    auth: InvestorAuthorization,
  },
  {
    path: '/settings',
    component: Settings,
  },
];
