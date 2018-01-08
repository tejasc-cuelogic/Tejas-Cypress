import Home from './home/Home';
import Profile from './profile/Profile';
import Register from './register/Register';
import Settings from './settings/Settings';
import Login from './login/Login';
import Confirm from './account/Confirm';
import Offerings from './offerings/Offerings';
import Offering from './offerings/Offering';
import Authorization from '../components/common/Authorization';
import ForgotPassword from './password/ForgotPassword';
import ResetPassword from './password/ResetPassword';


const UserAuthorization = Authorization(['user'], Home);
// const AdminAuthorization = Authorization(['user', 'manager', 'admin'], Home);

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
    path: '/offerings/:id',
    component: Offering,
  },
  {
    path: '/offerings',
    component: Offerings,
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/@:username',
    component: Profile,
    auth: UserAuthorization,
  },
  {
    path: '/forgot_password',
    component: ForgotPassword,
  },
  {
    path: '/reset_password',
    component: ResetPassword,
  },
  {
    path: '/',
    component: Home,
  },
];
