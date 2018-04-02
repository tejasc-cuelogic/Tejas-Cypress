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
