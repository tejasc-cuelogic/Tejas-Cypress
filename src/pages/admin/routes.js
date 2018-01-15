import UsersList from './containers/UsersList';
import { AdminAuthorization } from './../../components/common/Authorization';

export default [
  {
    path: '/admin/users-list',
    component: UsersList,
    auth: AdminAuthorization,
  },
];
