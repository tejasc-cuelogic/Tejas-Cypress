/**
 * @desc Validate only following fields from authStore in bulk validation after user submits data on
 */
export const REGISTRATION = [
  'givenName',
  'familyName',
  'email',
  'password',
  'verify',
  'role',
];

/**
 * @desc Validate only following fields from userStore in bulk validation after admin submits data
 *       while
 */
export const NEW_USER = [
  'givenName',
  'familyName',
  'email',
  'password',
  'roles',
];

/**
 * @desc Validate only following fields from profileStore in bulk validation after
 *      user submits data
 */
export const PROFILE_DETAILS = [
  'title',
  'firstLegalName',
  'lastLegalName',
  'residentalStreet',
  'city',
  'state',
  'zipCode',
  'phoneNumber',
  'dateOfBirth',
  'ssn',
];

/**
 * @desc Validate only following fields after submitting verification code to Confirm Phone Number
 */
export const CONFIRM_PHONE_NUMBER_VERIFICATION_CODE = [
  'code',
];

/**
 * @desc Validate only following fields after submitting verification code to Confirm Email Address
 */
export const CONFIRM_EMAIL_ADDRESS_VERIFICATION_CODE = [
  'code',
];

/**
 * @desc Validate only following fields after submitting identity form
 */
export const CONFIRM_IDENTITY_QUESTIONS = [
  'question1',
  'question2',
  'question3',
  'question4',
];

/**
 * @desc Validate onlt following fields after submitting Link Bank Account Form
 */
export const LINK_BANK_ACCCOUNT_FORM = [
  'bankRoutingNumber',
  'bankAccountNumber',
];

/**
 * @desc Pass fields in values if fields in keys needs validation
 */
export const CONDITIONAL_REQUIRE = {
  verify: 'password',
  legalStatusOtherDesc: 'legalStatusForm',
  securityOfferedOtherDesc: 'securityOfferedType',
  noOfSecurityOffered: 'securityOfferedType',
  overSubscriptionAllocationType: 'overSubscriptionAccepted',
  descOverSubscription: 'overSubscriptionAllocationType',
  maximumOfferingAmount: 'overSubscriptionAccepted',
};
