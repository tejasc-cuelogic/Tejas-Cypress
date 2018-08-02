export const DATE_FORMAT = 'M/D/YY';
export const DATE_ONLY = 'MMM DD, YYYY hh:mm a';
export const API_ROOT = process.env.REACT_APP_API_URL;
export const USE_DEV_TOOLS = process.env.REACT_APP_DEPLOY_ENV === 'localhost';

export const {
  REACT_APP_DEPLOY_ENV, REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH, REACT_APP_PROTECTION_API,
} = process.env;

export const SOCIAL_URLS = {
  instagram: 'https://instagram.com/thenextseed/',
  twitter: 'https://twitter.com/thenextseed',
  facebook: 'https://www.facebook.com/thenextseed',
};

export const MAX_BENEFICIARY_LIMIT = 5;
export const NS_SITE_EMAIL_SUPPORT = 'support@nextseed.com';
