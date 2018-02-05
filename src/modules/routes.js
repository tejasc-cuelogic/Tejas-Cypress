import About from './about/containers/About';
import Agreements from './agreements/containers/Agreements';
import Blog from './blog/containers/Blog';
import Business from '../modules/business/containers/Business';
import ChangePassword from '../modules/auth/ChangePassword';
import Confirm from '../modules/auth/Confirm';
import EdgarForm from '../modules/business/containers/EdgarForm';
import ForgotPassword from '../modules/auth/ForgotPassword';
import Home from './home/containers/Home';
import Invest from './invest/containers/Invest';
import Login from '../modules/auth/Login';
import Offering from './offering/containers/Offering';
import Register from '../modules/auth/Register';
import ResetPassword from '../modules/auth/ResetPassword';
import CaseStudies from './caseStudies/containers/CaseStudies';
import Dashboard from './dashboard/containers/Dashboard';
import { BusinessAuthorization } from '../components/common/Authorization';

export const publicRoutes = [
  {
    path: '/agreements/:section',
    component: Agreements,
  },
  {
    path: '/about/:section',
    component: About,
  },
  {
    path: '/blog/:postId',
    component: Blog,
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
    path: '/case-studies/:caseStudyId',
    component: CaseStudies,
  },
  {
    path: '/case-studies',
    component: CaseStudies,
  },
  {
    path: '/offerings/:offerId',
    component: Offering,
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
    path: '/dashboard',
    component: Dashboard,
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
    path: '/',
    component: Home,
    exact: true,
  },
];

export const privateRoutes = [
  {
    path: '/business/edgar',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/business',
    component: Business,
    auth: BusinessAuthorization,
  },
];
