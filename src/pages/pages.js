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
import Admin from './admin/Admin';
import NotFound from '../components/common/NotFound';
import Investor from './investor/Investor';
import Business from './business/Business';

const UserAuthorization = Authorization(['user'], NotFound);
const AdminAuthorization = Authorization(['investor', 'bowner', 'admin'], NotFound);
const BOwnerAuthorization = Authorization(['bowner'], NotFound);
const InvestorAuthorization = Authorization(['investor'], NotFound);

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
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
  },
  {
    path: '/admin',
    component: Admin,
    auth: AdminAuthorization,
  },
  {
    path: '/business',
    component: Business,
    auth: BOwnerAuthorization,
  },
  {
    path: '/investor',
    component: Investor,
    auth: InvestorAuthorization,
  },
  {
    path: '/',
    component: Home,
  },
];
