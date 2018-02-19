// Validate only following fields from authStore in bulk validation after user submits data on
// sign up form
export const REGISTRATION = [
  'givenName',
  'familyName',
  'email',
  'password',
  'verify',
  'role',
];

// Validate only following fields from userStore in bulk validation after admin submits data while
// creating new user
export const NEW_USER = [
  'givenName',
  'familyName',
  'email',
  'password',
  'roles',
];
