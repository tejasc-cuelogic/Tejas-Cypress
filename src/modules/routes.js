import Home from './home/containers/Home';
import Offering from './offering/containers/Offering';
import Invest from './invest/containers/Invest';
import Confirm from '../modules/auth/Confirm';
import Login from '../modules/auth/Login';
import Register from '../modules/auth/Register';
import ForgotPassword from '../modules/auth/ForgotPassword';
import ResetPassword from '../modules/auth/ResetPassword';
import ChangePassword from '../modules/auth/ChangePassword';
import EdgarForm from '../modules/business/EdgarForm';
import { BusinessAuthorization } from '../components/common/Authorization';

export default [
  {
    path: '/invest',
    component: Invest,
  },
  {
    path: '/offerings',
    component: Offering,
  },
  {
    path: '/confirm',
    component: Confirm,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
    exact: true,
  },
  {
    path: '/register',
    component: Register,
    exact: true,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    exact: true,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    exact: true,
  },
  {
    path: '/change-password',
    component: ChangePassword,
    exact: true,
  },
  {
    path: '/business',
    component: EdgarForm,
    exact: true,
    auth: BusinessAuthorization,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];
