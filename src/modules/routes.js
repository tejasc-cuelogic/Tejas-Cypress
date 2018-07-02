import About from './public/about/containers/About';
import Agreements from './public/agreements/containers/Agreements';
import Blog from './public/blog/containers/Blog';
import Home from './public/home/containers/Home';
import Invest from './public/invest/containers/Invest';
import Offering from './public/offering/containers/Offering';
import CaseStudies from './public/caseStudies/containers/CaseStudies';
import BusinessSignup from './public/businessSignup/containers/Signup';
import Business from './public/business/containers/Business';
import Edgar from './private/admin/edgar/containers/Business';
import EdgarForm from './private/admin/edgar/containers/EdgarForm';
import Base from './private/shared/basemodule/Base';
import Messages from './private/shared/messages/containers/Messages';
import Dashboard from './private/shared/dashboard/containers/Dashboard';
import Users from './private/admin/userManagement/containers/Users';
import UserDetails from './private/admin/userManagement/containers/UserDetails';
import UsersNew from './private/admin/userManagement/containers/UsersNew';
import ProfileSettings from './private/shared/settings/containers/ProfileSettings';
import XmlForm from './private/admin/edgar/containers/XmlForm';
import BusinessDetails from './private/admin/edgar/containers/BusinessDetails';
import AccountSetup from './private/investor/accountSetup/containers/AccountSetup';
import RewardsWallet from './private/investor/rewardsWallet/containers/RewardsWallet';
import Referrals from './private/investor/referrals/containers/Referrals';
import AccountDetails from './private/investor/accountDetails/containers/AccountDetails';
import BusinessApplication from './private/issuer/businessApplication/containers/BusinessApplication';
import Education from './private/shared/education/containers/Education';
import {
  AdminAuthorization,
  BusinessAuthorization,
  UserAuthorization,
  InvestorAuthorization,
} from '../theme/shared/Authorization';

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
    component: AccountSetup,
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

