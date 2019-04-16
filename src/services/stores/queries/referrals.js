import gql from 'graphql-tag';

export const getJwtReferralEmbeddedWidget = gql`
  query getJwtReferralEmbeddedWidget($id: String!, $accountId: String!, $email: String, $firstName: String, $lastName: String) {
    getJwtReferralEmbeddedWidget(
      id: $id,
      accountId: $accountId,
      email: $email,
      firstName: $firstName,
      lastName: $lastName
    )
  }
`;

export const getUserRewardBalance = gql`
  query getUserRewardBalance($userId: String) {
    getUserRewardBalance(userId: $userId)
  }
`;

export const getUserReferralDetails = gql`
  query getUserReferralDetails($userId: String) {
    getUserReferralDetails(userId: $userId) {
      availableCredit
      spentCredit
      totalEarnedCredit
      totalReferredUsers
      myShareLink
      emailShareLink
      twitterShareLink
      messengerShareLink
      facebookShareLink
      smsShareLink
      messengerMobileShareLink
    }
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
