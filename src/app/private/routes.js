import UserList from './pages/user/UserList';
import Settings from './pages/settings/Settings';
import BusinessForm from './pages/business/BusinessForm';
import New from './pages/user/New';
import Profile from './pages/user/Profile';

import {
  AdminAuthorization,
  BusinessAuthorization,
} from './../../components/common/Authorization';

export default [
  {
    path: '/admin/users/new',
    component: New,
    auth: AdminAuthorization,
  },
  {
    path: '/admin/users/:userId',
    component: Profile,
    auth: AdminAuthorization,
  },
  {
    path: '/admin/users',
    component: UserList,
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
