import Home from './home/Home';
// import Profile from './profile/Profile';
import Register from './register/Register';
// import Settings from './settings/Settings';
import Login from './login/Login';
import Confirm from './account/Confirm';
// import Offerings from './offerings/Offerings';
// import Offering from './offerings/Offering';
import Authorization from '../components/common/Authorization';
import ForgotPassword from './password/ForgotPassword';
import ResetPassword from './password/ResetPassword';
import Admin from './admin/Admin';
import UsersList from './admin/UsersList';
import NotFound from '../components/common/NotFound';
import Investor from './investor/Investor';
import Business from './business/Business';

// const UserAuthorization = Authorization(['user'], NotFound);
const AdminAuthorization = Authorization(['admin'], NotFound);
const BusinessAuthorization = Authorization(['bowner', 'admin'], NotFound);
const InvestorAuthorization = Authorization(['investor', 'admin'], NotFound);

export const publicRoutes = [
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

export const privateRoutes = {
  adminHome: {
    path: '/admin',
    component: Admin,
    auth: AdminAuthorization,
  },
  businessHome: {
    path: '/business',
    component: Business,
    auth: BusinessAuthorization,
  },
  investorHome: {
    path: '/investor',
    component: Investor,
    auth: InvestorAuthorization,
  },
  adminRoutes: [
    {
      path: '/users-list',
      component: UsersList,
      auth: AdminAuthorization,
    },
  ],
  businessRoutes: [
    {
      path: '/home',
      component: Business,
      auth: BusinessAuthorization,
    },
  ],
};


// export default [
//   {
//     path: '/login',
//     component: Login,
//   },
//   {
//     path: '/register',
//     component: Register,
//   },
//   {
//     path: '/confirm',
//     component: Confirm,
//   },
//   {
//     path: '/offerings/:id',
//     component: Offering,
//   },
//   {
//     path: '/offerings',
//     component: Offerings,
//   },
//   {
//     path: '/settings',
//     component: Settings,
//   },
//   {
//     path: '/@:username',
//     component: Profile,
//     auth: UserAuthorization,
//   },
//   {
//     path: '/forgot-password',
//     component: ForgotPassword,
//   },
//   {
//     path: '/reset-password',
//     component: ResetPassword,
//   },
//   {
//     path: '/admin',
//     component: Admin,
//     auth: AdminAuthorization,
//   },
//   {
//     path: '/business',
//     component: Business,
//     auth: BusinessAuthorization,
//   },
//   {
//     path: '/investor',
//     component: Investor,
//     auth: InvestorAuthorization,
//   },
//   {
//     path: '/',
//     component: Home,
//   },
// ];
