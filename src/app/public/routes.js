import Home from './home/Home';
import Register from './auth/Register';
import Login from './auth/Login';
import Confirm from './auth/Confirm';
// import Offerings from './offerings/Offerings';
// import Offering from './offerings/Offering';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import ChangePassword from './auth/ChangePassword';

export default [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/confirm',
    component: Confirm,
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
