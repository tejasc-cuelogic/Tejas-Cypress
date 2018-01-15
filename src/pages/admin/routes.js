import Authorization from '../../components/common/Authorization';
import NotFound from '../../components/common/NotFound';
import UsersList from './containers/UsersList';

const AdminAuthorization = Authorization(['admin'], NotFound);

export default [
  {
    path: '/admin/users-list',
    component: UsersList,
    auth: AdminAuthorization,
  },
];
