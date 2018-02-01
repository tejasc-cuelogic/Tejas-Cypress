import Home from './home/containers/Home';
import Offering from './offering/containers/Offering';
import Invest from './invest/containers/Invest';
import Confirm from '../modules/auth/Confirm';
import Login from '../modules/auth/Login';
import Register from '../modules/auth/Register';
import ForgotPassword from '../modules/auth/ForgotPassword';
import ResetPassword from '../modules/auth/ResetPassword';
import ChangePassword from '../modules/auth/ChangePassword';
import Business from './business/containers/Business';
import Blog from './blog/containers/Blog';
import About from './about/containers/About';

export default [
  {
    path: '/about/:section',
    component: About,
  },
  {
    path: '/blog',
    component: Blog,
  },
  {
    path: '/business',
    component: Business,
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
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/change-password',
    component: ChangePassword,
  },
  {
    path: '/',
    component: Home,
    exact: true,
  },
];
