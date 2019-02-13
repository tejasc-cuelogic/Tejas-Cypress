import Overview from './Overview';
import KeyTerms from './KeyTerms';
import Legal from './Legal';
import OfferingSection from './Offering';
import Leadership from './Leadership';
import BonusRewards from './BonusRewards';
import Media from './Media';
import Close from './Close';
import Investors from './Investors';
import Transactions from './Transactions';
import Updates from './Updates';
import Comments from './Comments';
import OfferingCreation from './OfferingCreation';
import ActivityHistory from '../../../shared/ActivityHistory';

const OfferingModule = (to) => {
  let module = null;
  switch (to) {
    case 'overview': module = Overview; break;
    case 'key-terms': module = KeyTerms; break;
    case 'legal': module = Legal; break;
    case 'offering': module = OfferingSection; break;
    case 'leadership': module = Leadership; break;
    case 'bonus-rewards': module = BonusRewards; break;
    case 'media': module = Media; break;
    case 'close': module = Close; break;
    case 'investors': module = Investors; break;
    case 'comments': module = Comments; break;
    case 'transactions': module = Transactions; break;
    case 'updates': module = Updates; break;
    case 'offering-creation': module = OfferingCreation; break;
    case 'activity-history': module = ActivityHistory; break;
    default: module = Overview; break;
  }
  return module;
};

export default OfferingModule;
