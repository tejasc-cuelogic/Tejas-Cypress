import gql from 'graphql-tag';

export const verifyCIPUser = gql`
  mutation verifyCIPUsers($userId: String! $user: userCIPInput) { 
    verifyCIPIdentity(userId: $userId, user: $user) {
      ... on UserCIPSoftFail{
        softFailId: id
        key
        message
        qualifiers {
          key
          message
        }
        questions {
          prompt
          type
          choices {
            text
          }
        }
      }
      
      ... on UserCIPHardFail{
        hardFailId: id
        key
        message
        qualifiers {
          key
          message
        }
      }
      
      ... on UserCIPPass {
        passId: id
        key
        message
        summary
      }

      ... on UserCIPFail {
        key
        message
      }
    }
  }`;

export const verifyCIPAnswers = gql`
  mutation verifyCIPAnswers($userId: String!, $cipAnswers: CIPAnswersInput){
    verifyCIPAnswers(userId: $userId, cipAnswers: $cipAnswers) {
      ... on UserCIPSoftFail{
        softFailId: id
        key
        message
        qualifiers {
          key
          message
        }
        questions {
          prompt
          type
          choices {
            text
          }
        }
      }
    
      ... on UserCIPHardFail{
        hardFailId: id
        key
        message
        qualifiers {
          key
          message
        }
      }
    
      ... on UserCIPPass {
        passId: id
        key
        message
        summary
      }
    }
  }`;

export const startUserPhoneVerification = gql`
  mutation _startUserPhoneVerification($phoneDetails: phoneInput! $method: PhoneVerificationMethodsEnum!) {
    startUserPhoneVerification(phoneDetails: $phoneDetails method: $method) {
      carrier
      is_cellphone
      message
      seconds_to_expire
      uuid
      success
    }
  }`;

export const checkUserPhoneVerificationCode = gql`
  mutation _checkUserPhoneVerificationCode($phoneDetails: phoneInput! $verificationCode: String!) {
    checkUserPhoneVerificationCode(phoneDetails: $phoneDetails  verificationCode: $verificationCode) {
      message
      success
    }
 }`;

export const updateUserCIPInfo = gql`
  mutation updateUserCIPInfo($userId: String! $user: userCIPInput! $phoneDetails: phoneInput!) {
    updateUserCIPInfo(userId: $userId user: $user phoneDetails: $phoneDetails) {
      id
      email
      firstName
      lastName
      lastLoginDate
      accreditation
    }
  }`;
