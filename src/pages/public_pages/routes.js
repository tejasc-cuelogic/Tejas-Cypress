import Home from './home/Home';
import Register from './register/Register';
import Login from './login/Login';
import Confirm from './account/Confirm';
// import Offerings from './offerings/Offerings';
// import Offering from './offerings/Offering';
import ForgotPassword from './password/ForgotPassword';
import ResetPassword from './password/ResetPassword';

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
    path: '/',
    component: Home,
  },
];
