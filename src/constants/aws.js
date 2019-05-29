export const USER_POOL_ID = process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID;
export const COGNITO_CLIENT_ID = process.env.REACT_APP_AWS_COGNITO_CLIENT_ID;
export const AWS_REGION = process.env.REACT_APP_AWS_REGION;
export const COGNITO_IDENTITY_POOL_ID = process.env.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID;
export const API_VERSION = process.env.AWS_COGNITO_API_VERSION;
export const LIST_LIMIT = 10;
export const STATUSES = {
  deleted: 'DELETED',
};

export const UPLOADS_CONFIG = {
  region: AWS_REGION || 'ap-south-1',
  bucket: process.env.REACT_APP_UPLOADS_BUCKET,
  accessKey: process.env.REACT_APP_UPLOADS_ACCESS_KEY,
  secretKey: process.env.REACT_APP_UPLOADS_SECRET_KEY,
};

export const ASSETS_URL = `https://${process.env.REACT_APP_UPLOADS_BUCKET}/assets/`;
