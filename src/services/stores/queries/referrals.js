import gql from 'graphql-tag';

export const getJwtReferralEmbeddedWidget = gql`
  query getJwtReferralEmbeddedWidget($userId: String, $accountId: String, $allowAnonymous: Boolean) {
    getJwtReferralEmbeddedWidget(
      userId: $userId,
      accountId: $accountId,
      allowAnonymous: $allowAnonymous
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
