import UsersList from './pages/user/UsersList';
import Settings from './pages/Settings';

import { AdminAuthorization } from './../../components/common/Authorization';

export default [
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
];
