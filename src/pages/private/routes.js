import Admin from './admin/Admin';
import Users from './admin/containers/Users';
import Business from './business/Business';
import Investor from './investor/Investor';
import Settings from './common/Settings';

import {
  AdminAuthorization,
  BusinessAuthorization,
  InvestorAuthorization,
} from './../../components/common/Authorization';

export default [
  {
    path: '/admin/users',
    component: Users,
    auth: AdminAuthorization,
  },
  {
    path: '/admin',
    component: Admin,
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
