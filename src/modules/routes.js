import About from './about/containers/About';
import Agreements from './agreements/containers/Agreements';
import Blog from './blog/containers/Blog';
import ChangePassword from '../modules/auth/ChangePassword';
import Confirm from '../modules/auth/Confirm';
import EdgarForm from '../modules/business/EdgarForm';
import ForgotPassword from '../modules/auth/ForgotPassword';
import Home from './home/containers/Home';
import Invest from './invest/containers/Invest';
import Login from '../modules/auth/Login';
import Offering from './offering/containers/Offering';
import Register from '../modules/auth/Register';
import ResetPassword from '../modules/auth/ResetPassword';

import { BusinessAuthorization } from '../components/common/Authorization';

export default [
  {
    path: '/agreements/:section',
    component: Agreements,
  },
  {
    path: '/about/:section',
    component: About,
  },
  {
    path: '/blog',
    component: Blog,
  },
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
