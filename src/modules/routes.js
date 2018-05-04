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
import Settings from './../modules/settings/containers/Settings';
import CaseStudies from './caseStudies/containers/CaseStudies';
import BonusRewardFulfillment from './bonusRewardFulfillment/containers/BonusRewardFulfillment';
import Banking from './banking/containers/Banking';
import Messages from './messages/containers/Messages';
import Dashboard from './dashboard/containers/Dashboard';
import Users from './users/containers/Users';
import XmlForm from './business/containers/XmlForm';
import BusinessDetails from './business/containers/BusinessDetails';
import Summary from '../modules/summary/containers/Summary';
import RewardsWallet from '../modules/rewardsWallet/containers/RewardsWallet';
import Referrals from '../modules/referrals/containers/Referrals';
import Education from '../modules/education/containers/Education';
import Individual from '../modules/individual/containers/Individual';
import {
  AdminAuthorization,
  BusinessAuthorization,
  UserAuthorization,
  InvestorAuthorization,
} from '../components/common/Authorization';

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
];

export const privateRoutes = [
  {
    path: '/app/business/:businessId/edgar/:filingId',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/business/:businessId/edgar',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/business/:businessId/filing/:filingId/xml/:xmlId',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/business/:businessId/filing/:filingId/xml',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/business/:businessId',
    component: BusinessDetails,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/business',
    component: Business,
    auth: BusinessAuthorization,
    exact: true,
  },
  {
    path: '/app/users/:userId/:section',
    component: Users,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/users/new',
    component: Users,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/users',
    component: Users,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/settings',
    component: Settings,
    auth: UserAuthorization,
  },
  {
    path: '/app/messages',
    component: Messages,
    auth: UserAuthorization,
  },
  {
    path: '/app/bonus-reward-fulfillment',
    component: BonusRewardFulfillment,
    auth: UserAuthorization,
  },
  {
    path: '/app/banking',
    component: Banking,
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
    path: '/app/individual',
    exact: false,
    component: Individual,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/rewardswallet',
    component: RewardsWallet,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/referrals',
    component: Referrals,
    auth: InvestorAuthorization,
  },
  {
    path: '/app/education',
    component: Education,
    auth: InvestorAuthorization,
  },
];
