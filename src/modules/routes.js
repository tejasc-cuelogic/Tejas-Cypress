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
import Messages from './private/shared/messages/containers/Messages';
import Dashboard from './private/issuer/dashboard';
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

import Insights from './private/admin/insights';
import Faqs from './private/admin/faqs';
import Activities from './private/admin/activities';
import Ambassadors from './private/admin/ambassadors';
import Applications from './private/admin/applications';
import Beneficiaries from './private/admin/beneficiaries';
import Campaigns from './private/admin/campaigns';
import CrowdPay from './private/admin/crowdPay';
import Deployments from './private/admin/deployments';
import Investments from './private/admin/investments';
import KnowledgeBase from './private/admin/knowledgeBase';
import Repayments from './private/admin/repayments';
import Team from './private/admin/team';
import Transactions from './private/admin/transactions';
import Events from './private/issuer/events';

import {
  AdminAuthorization,
  BusinessAuthorization,
  UserAuthorization,
  InvestorAuthorization,
} from '../modules/shared/Authorization';

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
    path: '/app/insights',
    component: Insights,
    auth: AdminAuthorization,
  },
  {
    path: '/app/faqs',
    component: Faqs,
    auth: AdminAuthorization,
  },
  {
    path: '/app/activities',
    component: Activities,
    auth: AdminAuthorization,
  },
  {
    path: '/app/ambassadors',
    component: Ambassadors,
    auth: AdminAuthorization,
  },
  {
    path: '/app/applications',
    component: Applications,
    auth: AdminAuthorization,
  },
  {
    path: '/app/beneficiaries',
    component: Beneficiaries,
    auth: AdminAuthorization,
  },
  {
    path: '/app/campaigns',
    component: Campaigns,
    auth: AdminAuthorization,
  },
  {
    path: '/app/crowdPay',
    component: CrowdPay,
    auth: AdminAuthorization,
  },
  {
    path: '/app/deployments',
    component: Deployments,
    auth: AdminAuthorization,
  },
  {
    path: '/app/investments',
    component: Investments,
    auth: AdminAuthorization,
  },
  {
    path: '/app/knowledge-base',
    component: KnowledgeBase,
    auth: AdminAuthorization,
  },
  {
    path: '/app/repayments',
    component: Repayments,
    auth: AdminAuthorization,
  },
  {
    path: '/app/team',
    component: Team,
    auth: AdminAuthorization,
  },
  {
    path: '/app/transactions',
    component: Transactions,
    auth: AdminAuthorization,
  },
  {
    path: '/app/events',
    component: Events,
    auth: BusinessAuthorization,
  },
];
