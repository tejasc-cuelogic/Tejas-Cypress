import ReferralProgramTerms from './public/agreements/ReferralProgramTerms';
import AccreditedIncentiveTerms from './public/agreements/AccreditedIncentiveTerms';
import IraPromotionTerms from './public/agreements/IraPromotionTerms';
import Agreements from './public/agreements/containers/Agreements';
import Home from './public/home/containers/Home';
import Invest from './public/invest/containers/Invest';
import Offering from './public/offering/containers/Offering';
import OfferDetails from './public/offering/containers/OfferDetails';
import CollectionDetails from './public/collections/containers/CollectionDetails';
// import VideoModal from './public/offering/components/campaignDetails/Overview/VideoModal';
import CaseStudies from './public/caseStudies/containers/CaseStudies';
import BusinessSignup from './public/businessSignup/containers/Signup';
import Business from './public/business/containers/Business';
import Resources from './public/resources';
import Partners from './public/partners';
import News from './public/news';
import Insights from './public/resources/containers/Insights';
import InsightsDetails from './public/resources/containers/InsightsDetails';
import EducationCenter from './public/resources/containers/EducationCenter';
import Space from './public/space/containers/Space';
import Group from './public/about/components/Group';
import Mission from './public/about/components/Mission';
import Team from './public/about/components/Team';
import Edgar from './private/admin/edgar/containers/Business';
import EdgarForm from './private/admin/edgar/containers/EdgarForm';
import XmlForm from './private/admin/edgar/containers/XmlForm';
import BusinessDetails from './private/admin/edgar/containers/BusinessDetails';
import UserManagement from './private/admin/userManagement';
import DashboardCta from './shared/DashboardCta';
import Collections from './public/collections/containers/Collections';

import {
  AdminAuthorization,
  BusinessAuthorization,
  // UserAuthorization,
} from './shared/Authorization';

export const publicRoutes = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/init-dashboard',
    component: DashboardCta,
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
    path: '/legal',
    component: Agreements,
  },
  {
    path: '/about/:section?', // optional section to support old urls
    component: Mission,
  },
  {
    path: '/mission',
    component: Mission,
  },
  {
    path: '/team',
    component: Team,
  },
  {
    path: '/invest/get-started',
    component: News,
  },
  {
    path: '/investors',
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
    path: '/offerings/:id/herovideo',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/offerings/:id',
    component: OfferDetails,
    props: 'newLayout',
  },
  {
    path: '/communities/:slug',
    component: CollectionDetails,
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
    path: '/communities',
    component: Collections,
  },
  {
    path: '/business',
    component: Business,
  },
  {
    path: '/insights/category/:id',
    component: Insights,
  },
  {
    path: '/insights/:slug',
    component: InsightsDetails,
  },
  {
    path: '/insights',
    component: Insights,
  },
  {
    path: '/education-center',
    component: EducationCenter,
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
  {
    path: '/space',
    component: Space,
  },
  {
    path: '/group',
    component: Group,
  },
];

export const privateRoutes = [
  {
    path: '/dashboard/edgar/:offeringId/edgar/:filingId',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/dashboard/edgar/:offeringId/edgar',
    component: EdgarForm,
    auth: BusinessAuthorization,
  },
  {
    path: '/dashboard/edgar/:offeringId/filing/:filingId/xml/:xmlId',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/dashboard/edgar/:offeringId/filing/:filingId/xml',
    component: XmlForm,
    auth: AdminAuthorization,
  },
  {
    path: '/dashboard/edgar/:offeringId',
    component: BusinessDetails,
    auth: BusinessAuthorization,
  },
  {
    path: '/dashboard/edgar',
    component: Edgar,
    auth: BusinessAuthorization,
    exact: true,
  },
  {
    path: '/dashboard/users',
    component: UserManagement,
    auth: AdminAuthorization,
  },
];
