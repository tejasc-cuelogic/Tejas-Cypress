const COMMON = [
  { from: 'auth/login', live: true, to: '/login' },
  { from: 'auth/register', live: true, to: '/register' },
  { from: 'apply', live: true, to: '/business-application/business' },
  { from: 'auth/register-investor', live: true, to: '/register-investor' },
  { from: 'auth/welcome-email', live: true, to: '/welcome-email' },
  { from: 'auth/confirm-email', live: true, to: '/confirm-email' },
  { from: 'auth/change-password', live: true, to: '/change-password' },
  { from: 'auth/reset-password', live: true, to: '/reset-password' },
  { from: 'auth/forgot-password', live: true, to: '/forgot-password' },
  { from: 'blog', live: true, to: '/resources/insights' },
  { from: 'blog/:param1', live: true, to: '/resources/insights/:param1' },
  { from: 'railway', live: true, to: '/teamrailway' },
];
export const PRODUCTION_REDIRECT_META = [
  ...COMMON,
  { from: 'rh50', live: true, to: '/invest?utm_campaign=saasquatch&rsCode=RH50', rsCode: 'RH50', rsRedirect: '/offerings/railway-heights' },
  { from: 'get20', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=GET20&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
  { from: 'greenway', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=GWAY&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
];

export const DEV_REDIRECT_META = [
  ...COMMON,
  { from: 'batmansucks', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=BATMANSUCKS&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
];

export const REDIRECT_META = ['production', 'prod', 'master'].includes(process.env.REACT_APP_DEPLOY_ENV) ? PRODUCTION_REDIRECT_META : DEV_REDIRECT_META;
