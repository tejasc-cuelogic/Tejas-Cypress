import Home from './home/Home';
import Profile from './profile/Profile';
import Register from './register/Register';
import Settings from './settings/Settings';
import Login from './login/Login';
import Authorization from '../components/common/Authorization';


const UserAuthorization = Authorization(['user'], Home)
const AdminAuthorization = Authorization(['user', 'manager', 'admin'], Home)

export default [
  {
    path:'/login',
    component: Login
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/settings',
    component: Settings,
    auth: AdminAuthorization
  },
  {
    path: '/@:username',
    component: Profile,
    auth: UserAuthorization
  },
  {
    path: '/',
    component: Home
  }
];
