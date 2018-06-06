import About from './public/about/containers/About';
import Agreements from './public/agreements/containers/Agreements';
import Blog from './public/blog/containers/Blog';
import Home from './public/home/containers/Home';
import Invest from './public/invest/containers/Invest';
import Offering from './public/offering/containers/Offering';
import CaseStudies from './public/caseStudies/containers/CaseStudies';
import BusinessSignup from './public/businessSignup/containers/Signup';
import Business from './public/business/containers/Business';
import Edgar from './edgar/containers/Business';
import EdgarForm from '../modules/edgar/containers/EdgarForm';
import ForgotPassword from '../modules/auth/ForgotPassword';
import ResetPassword from '../modules/auth/ResetPassword';
import Base from './basemodule/Base';
import Messages from './private/messages/containers/Messages';
import Dashboard from './dashboard/containers/Dashboard';
import Users from './private/users/containers/Users';
import UserDetails from './private/users/containers/UserDetails';
import UsersNew from './private/users/containers/UsersNew';
import ProfileSettings from './private/users/containers/ProfileSettings';
import XmlForm from './edgar/containers/XmlForm';
import BusinessDetails from './edgar/containers/BusinessDetails';
import Summary from '../modules/summary/containers/Summary';
import RewardsWallet from './private/rewardsWallet/containers/RewardsWallet';
import Referrals from './private/referrals/containers/Referrals';
import AccountDetails from './private/accountDetails/containers/AccountDetails';
import BusinessApplication from './private/businessApplication/containers/BusinessApplication';
import Education from './private/education/containers/Education';
import {
  AdminAuthorization,
  BusinessAuthorization,
  UserAuthorization,
  InvestorAuthorization,
} from '../theme/common/Authorization';

export const publicRoutes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
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
    path: '/business',
    component: Business,
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
    path: '/business-application',
    component: BusinessSignup,
    exact: true,
  },
  {
    path: '/business-application/:status?/:reason?',
    component: BusinessSignup,
    exact: true,
  },
];

export const privateRoutes = [
  {
    path: '/app/edgar/:businessId/edgar/:filingId',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/edgar/:businessId/edgar',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/edgar/:businessId/filing/:filingId/xml/:xmlId',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/edgar/:businessId/filing/:filingId/xml',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/edgar/:businessId',
    component: BusinessDetails,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/edgar',
    component: Edgar,
    auth: BusinessAuthorization,
    exact: true,
  },
  {
    path: '/app/manage/:entity',
    component: Base,
    auth: BusinessAuthorization,
    exact: true,
  },
  {
    path: '/app/users/new',
    component: UsersNew,
    auth: AdminAuthorization,
  },
  {
    path: '/app/users/:userId',
    component: UserDetails,
    auth: AdminAuthorization,
  },
  {
    path: '/app/users',
    component: Users,
    auth: AdminAuthorization,
  },
  {
    path: '/app/messages',
    component: Messages,
    auth: UserAuthorization,
  },
  {
    path: '/app/dashboard',
    component: Dashboard,
    exact: true,
    auth: UserAuthorization,
  },
  {
    path: '/app/summary',
    component: Summary,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/account-details/:accountType(individual|ira|entity)',
    exact: false,
    component: AccountDetails,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/profile-settings',
    exact: false,
    component: ProfileSettings,
    auth: UserAuthorization,
  },
  {
    path: '/app/business-application',
    exact: false,
    component: BusinessApplication,
    auth: UserAuthorization,
  },
  {
    path: '/app/rewards-wallet',
    component: RewardsWallet,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/referrals',
    component: Referrals,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/resources',
    component: Education,
    auth: UserAuthorization,
  },
  {
    path: '/app/page/:pageId',
    component: Base,
    auth: UserAuthorization,
  },
];

