import UsersList from './pages/user/UsersList';
import Settings from './pages/Settings';
import BusinessForm from './pages/business/BusinessForm';

import {
  AdminAuthorization,
  BusinessAuthorization,
} from './../../components/common/Authorization';

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
  {
    path: '/business',
    component: BusinessForm,
    auth: BusinessAuthorization,
  },
];
