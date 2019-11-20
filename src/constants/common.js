export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_ONLY = 'MMM DD, YYYY hh:mm a';
export const API_ROOT = 'https://predev-api-us-east-1.nextseed.qa/predev';

export const REACT_APP_DEPLOY_ENV = 'predev';

export const REACT_APP_PROTECTION_API = 'https://xwb5gjatlc.execute-api.us-east-1.amazonaws.com/dev';

export const REACT_APP_PUBLIC_API = 'https://predev-appsync-us-east-1.nextseed.qa';

export const REACT_APP_PUBLIC_API_KEY = 'da2-6tv7jz23wnfdjf7lhbqpwh2xg4';

export const {
  REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH,
} = process.env;

export const SOCIAL_URLS = {
  instagram: 'https://instagram.com/thenextseed/',
  twitter: 'https://twitter.com/thenextseed',
  facebook: 'https://www.facebook.com/thenextseed',
};

export const MAX_BENEFICIARY_LIMIT = 5;
export const NS_SITE_EMAIL_SUPPORT = 'support@nextseed.com';

export const NEXTSEED_BOX_URL = 'https://nextseed.app.box.com/';
export const NEXTSEED_SECURITIES_BOX_URL = 'https://nextseedsecurities.app.box.com/';

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
  MIGRATION: 'MIGRATION',
  PREQUAL: 'PREQUAL',
  ACCOUNT: 'ACCOUNT',
  OFFER: 'OFFER',
  OFFERING: 'OFFERING',
  CREATION: 'CREATION',
  LIVE: 'LIVE',
  ES_JOBID: 'ES_JOBID',
};

export const ACTIVITY_HISTORY_SCOPE = {
  ADMIN: 'ADMIN',
  ISSUER: 'ISSUER',
  INVESTOR: 'INVESTOR',
  DEV: 'DEV',
};

export const SAASQUATCH_TENANT_ALIAS = 'test_abcvl6vhwmkrk';

export const FROALA_EDITOR_LICENSE = 'FC1D2F2A1uB5A2B1B1A5F1A4E1A3A15hD-17soljC-7I-7xB5oD-13==';

export const userIdleTime = ['production', 'prod', 'master', 'infosec'].includes(process.env.REACT_APP_DEPLOY_ENV) ? (1000 * 60 * 60 * 1) : (1000 * 60 * 60 * 12);

export const isLoggingEnabled = ['localhost', 'dev'].includes(process.env.REACT_APP_DEPLOY_ENV);

export const DEFAULT_TIME_ZONE_TO_DISPLAY = 'America/Chicago';

export const IMAGE_UPLOAD_ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png'];

export const DOCUMENT_UPLOAD_ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'odt', 'csv'];

export const DEV_FEATURE_ONLY = ['localhost', 'develop', 'dev', 'review'].includes(REACT_APP_DEPLOY_ENV);

export const ELIGIBLE_TAGS = ['CJEVENT'];

export const isProduction = ['production', 'prod'].includes(REACT_APP_DEPLOY_ENV);
