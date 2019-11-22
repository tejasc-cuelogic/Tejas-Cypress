import About from './public/about/containers/About';
import ReferralProgramTerms from './public/agreements/ReferralProgramTerms';
import AccreditedIncentiveTerms from './public/agreements/AccreditedIncentiveTerms';
import IraPromotionTerms from './public/agreements/IraPromotionTerms';
import Agreements from './public/agreements/containers/Agreements';
import Home from './public/home/containers/Home';
import Invest from './public/invest/containers/Invest';
import Offering from './public/offering/containers/Offering';
import OfferDetails from './public/offering/containers/OfferDetails';
import CaseStudies from './public/caseStudies/containers/CaseStudies';
import BusinessSignup from './public/businessSignup/containers/Signup';
import Business from './public/business/containers/Business';
import Resources from './public/resources';
import Partners from './public/partners';
import News from './public/news';

import Edgar from './private/admin/edgar/containers/Business';
import EdgarForm from './private/admin/edgar/containers/EdgarForm';
import XmlForm from './private/admin/edgar/containers/XmlForm';
import BusinessDetails from './private/admin/edgar/containers/BusinessDetails';
import UserManagement from './private/admin/userManagement';
import DashboardCta from './shared/DashboardCta';

import {
  AdminAuthorization,
  BusinessAuthorization,
  // UserAuthorization,
} from './shared/Authorization';

export const publicRoutes = [
  {
    path: '/',
    component: Home,
    title: 'Home',
    exact: true,
  },
  {
    path: '/dashboard',
    component: DashboardCta,
    exact: true,
  },
  {
    path: '/subscribe/newsletter',
    component: Home,
    exact: true,
  },
  {
    path: '/agreements/referral-program-terms-and-conditions',
    component: ReferralProgramTerms,
  },
  {
    path: '/agreements/Accredited-Investor-Verification-Incentive-Program-Terms-and-Conditions',
    component: AccreditedIncentiveTerms,
  },
  {
    path: '/agreements/ira-promotion-terms-and-conditions',
    component: IraPromotionTerms,
  },
  {
    path: '/agreements/:section',
    component: Agreements,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/invest/get-started',
    component: News,
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
    path: '/offerings-v2/preview/:id',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/offerings-v2/:id',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/offerings/preview/:id',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/offerings/:id',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/offerings-v1/preview/:id',
    component: OfferDetails,
  },
  {
    path: '/offerings-v1/:id',
    component: OfferDetails,
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
    path: '/resources',
    component: Resources,
  },
  {
    path: '/partners',
    component: Partners,
  },
  {
    path: '/business-application',
    component: BusinessSignup,
    // exact: true,
  },
];

export const privateRoutes = [
  {
    path: '/app/edgar/:offeringId/edgar/:filingId',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/edgar/:offeringId/edgar',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/app/edgar/:offeringId/filing/:filingId/xml/:xmlId',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/edgar/:offeringId/filing/:filingId/xml',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/app/edgar/:offeringId',
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
    path: '/app/users',
    component: UserManagement,
    auth: AdminAuthorization,
  },
];
