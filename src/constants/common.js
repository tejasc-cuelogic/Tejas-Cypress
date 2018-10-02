export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_ONLY = 'MMM DD, YYYY hh:mm a';
export const API_ROOT = process.env.REACT_APP_API_URL;

export const {
  REACT_APP_DEPLOY_ENV, REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH, REACT_APP_PROTECTION_API,
} = process.env;

export const {
  REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY,
} = process.env;

export const SOCIAL_URLS = {
  instagram: 'https://instagram.com/thenextseed/',
  twitter: 'https://twitter.com/thenextseed',
  facebook: 'https://www.facebook.com/thenextseed',
};

export const MAX_BENEFICIARY_LIMIT = 5;
export const NS_SITE_EMAIL_SUPPORT = 'support@nextseed.com';

export const FILE_UPLOAD_HANDLE_URL = 'https://nextseed.app.box.com/file/';

export const ACTIVITY_HISTORY_TYPES = {
  COMMENT: 'COMMENT',
  ACTIVITY: 'ACTIVITY',
  UPLOAD: 'UPLOAD',
  RATING: 'RATING',
  CF_LIMIT: 'CF_LIMIT',
  ACCREDITATION: 'ACCREDITATION',
  ACCESS: 'ACCESS',
  ADMIN_ACTIVITY: 'ADMIN_ACTIVITY',
  MFA: 'MFA',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
};

export const ACTIVITY_HISTORY_SCOPE = {
  ADMIN: 'ADMIN',
  ISSUER: 'ISSUER',
  INVESTOR: 'INVESTOR',
};
