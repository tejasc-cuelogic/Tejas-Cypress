import UsersList from './pages/user/UsersList';

import { AdminAuthorization } from './../../components/common/Authorization';

export default [
  {
    path: '/admin/users',
    component: UsersList,
    auth: AdminAuthorization,
  },
];
