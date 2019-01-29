import gql from 'graphql-tag';

export const getJwtReferralEmbeddedWidget = gql`
  query getJwtReferralEmbeddedWidget($userId: String!, $accountId: String!, $email: String, $firstName: String, $lastName: String) {
    getJwtReferralEmbeddedWidget(
      userId: $userId,
      accountId: $accountId,
      email: $email,
      firstName: $firstName,
      lastName: $lastName
    )
  }
`;

export const getReferralCreditsInformation = gql`
  query getReferralCreditsInformation($code: String!) {
    getReferralCreditsInformation(code: $code) {
      name
      type
    }
  }
`;

export const upsertUserReferralCredits = gql`
mutation upsertUserReferralCredits($userId: String!){
  upsertUserReferralCredits(userId: $userId)
  } 
`;

export const userPartialSignupWithReferralCode = gql`
mutation userPartialSignupWithReferralCode($code: String!){
  userPartialSignupWithReferralCode(code: $code)
  } 
`;

export const userFullSignupWithReferralCode = gql`
mutation userFullSignupWithReferralCode($userId: String!){
  userFullSignupWithReferralCode(userId: $userId)
  } 
`;
