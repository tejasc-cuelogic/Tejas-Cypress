import Users from './pages/user/UsersList';

import { AdminAuthorization } from './../../components/common/Authorization';

export default [
  {
    path: '/admin/users',
    component: Users,
    auth: AdminAuthorization,
  },
];
