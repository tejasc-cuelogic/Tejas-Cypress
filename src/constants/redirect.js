export const PRODUCTION_REDIRECT_META = [
  { from: 'get20', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=GET20&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
  { from: 'greenway', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=GWAY&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
  { from: 'login', live: true, to: '/auth/login' },
  { from: 'register', live: true, to: '/auth/register' },
  { from: 'forgot-password', live: true, to: '/auth/forgot-password' },
];

export const DEV_REDIRECT_META = [
  { from: 'login', live: true, to: '/auth/login' },
  { from: 'register', live: true, to: '/auth/register' },
  { from: 'forgot-password', live: true, to: '/auth/forgot-password' },
  { from: 'batmansucks', live: true, to: '/invest/why-nextseed?utm_source=invite&utm_medium=link&utm_campaign=saasquatch&rsCode=BATMANSUCKS&rsShareMedium=UNKNOWN&rsEngagementMedium=UNKNOWN' },
];

export const REDIRECT_META = ['production', 'prod', 'master'].includes(process.env.REACT_APP_DEPLOY_ENV) ? PRODUCTION_REDIRECT_META : DEV_REDIRECT_META;
