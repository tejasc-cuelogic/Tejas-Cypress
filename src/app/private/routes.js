import UsersList from './pages/user/UsersList';
import Settings from './pages/Settings';
import BusinessForm from './pages/business/BusinessForm';
import UserNew from './pages/user/UserNew';
import UserProfile from './pages/user/UserProfile';

import {
  AdminAuthorization,
  BusinessAuthorization,
} from './../../components/common/Authorization';

export default [
  {
    path: '/admin/user/New',
    component: UserNew,
    auth: AdminAuthorization,
  },
  {
    path: '/admin/user/:userId',
    component: UserProfile,
    auth: AdminAuthorization,
  },
  {
    path: '/admin/users',
    component: UsersList,
    auth: AdminAuthorization,
  },
  {
    path: '/settings',
    component: Settings,
    auth: AdminAuthorization,
  },
  {
    path: '/business',
    component: BusinessForm,
    auth: BusinessAuthorization,
  },
];
