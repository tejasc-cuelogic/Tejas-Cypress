import UserList from './pages/user/UserList';
import Settings from './pages/settings/Settings';
import New from './pages/user/New';
import Profile from './pages/user/Profile';

import {
  AdminAuthorization,
  BusinessAuthorization,
  UserAuthorization,
} from './../../theme/common/Authorization';

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
    auth: UserAuthorization,
  },
];
