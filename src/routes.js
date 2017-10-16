import Home from './views/Home';
import Profile from './views/Profile';
import Register from './views/Register';
import Settings from './views/Settings';
import Login from './views/Login';
import Authorization from './components/Common/Authorization';


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
    component: Settings
  },
  {
    path: '/@:username',
    component: Profile,
    auth: UserAuthorization
  },
  {
    path: '/@:username/favorites',
    component: Profile
  },
  {
    path: '/',
    component: Home
  }
];
