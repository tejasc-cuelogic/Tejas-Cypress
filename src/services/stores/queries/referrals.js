import gql from 'graphql-tag';

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

export const userPartialSignupWithReferralCode = gql`
mutation userPartialSignupWithReferralCode($code: String!){
  userPartialSignupWithReferralCode(code: $code)
  } 
`;
