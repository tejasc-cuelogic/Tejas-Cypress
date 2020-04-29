export const DATE_FORMAT = 'MM/DD/YYYY';
export const DATE_ONLY = 'MMM DD, YYYY hh:mm a';
export const API_ROOT = process.env.REACT_APP_API_URL;

export const {
  REACT_APP_DEPLOY_ENV, REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH, REACT_APP_PROTECTION_API,
} = process.env;

export const {
  REACT_APP_PUBLIC_API, REACT_APP_PUBLIC_API_KEY, NODE_ENV,
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

export const SAASQUATCH_TENANT_ALIAS = process.env.REACT_APP_SAASQUATCH_TENANT_ALIAS;

export const FROALA_EDITOR_LICENSE = process.env.REACT_APP_FROALA_API_KEY_NEW;

export const userIdleTime = ['production', 'prod', 'master', 'infosec'].includes(process.env.REACT_APP_DEPLOY_ENV) ? (1000 * 60 * 60 * 1) : (1000 * 60 * 60 * 12);

export const isLoggingEnabled = ['localhost', 'dev'].includes(process.env.REACT_APP_DEPLOY_ENV);

export const DEFAULT_TIME_ZONE_TO_DISPLAY = 'America/Chicago';

export const IMAGE_UPLOAD_ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png'];

export const DOCUMENT_UPLOAD_ALLOWED_EXTENSIONS = ['jpeg', 'jpg', 'png', 'pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'odt', 'csv'];

export const DEV_FEATURE_ONLY = ['localhost', 'dev', 'review'].includes(REACT_APP_DEPLOY_ENV);

export const ELIGIBLE_TAGS = ['CJEVENT'];

export const isProduction = ['production', 'prod'].includes(REACT_APP_DEPLOY_ENV);

export const RETRY_CONFIG = {
  delay: {
    initial: 100, max: 3000, jitter: false,
  },
  attempts: {
    max: 5,
    retryIf: error => !!error && error.message === 'Failed to fetch',
  },
};

export const CURR_YEAR = new Date().getFullYear();

export const S3_BUCKET_URL = `https://${process.env.REACT_APP_UPLOADS_BUCKET}`;

export const MINIMUM_AUTODRAFT_AMOUNT_WIRE = '10000';
