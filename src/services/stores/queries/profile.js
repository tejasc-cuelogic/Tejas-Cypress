import gql from 'graphql-tag';

export const verifyCIPUser = gql`
mutation verifyCIPUsers($userId: String!, $user: UserCIPInput){
    verifyCIPIdentity(userId: $userId, user: $user){
      ... on UserCIPSoftFail{
        softFailId: id
        key
        message
        qualifiers {
          key
          message
        }
        questions{
          prompt
          type
          choices {
            text
          }
        }
      }
      ... on UserCIPPass{
        passId: id
        key
        message
        summary
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
      ... on UserCIPFail{
        key
        message
      }
    }
  }`;

export const verifyCIPAnswers = gql`
  mutation verifyCIPAnswers($cipAnswers: CIPAnswersInput){
    verifyCIPAnswers(cipAnswers: $cipAnswers) {
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
mutation updateUserCIPInfo($user: UserCIPInput!, $phoneDetails: phoneInput!, $cip: UserCIPInformation) {
    updateUserCIPInfo(user: $user, phoneDetails: $phoneDetails, cip: $cip) {
      email {
        address
      } info{
        firstName
        lastName
      } lastLoginDate
      accreditation {
        status
      }
    }
  }`;

export const updateUserProfileData = gql`
  mutation _updateUserProfileData($profileDetails: UserInfoInput!, $legalDetails: AddressInput, $targetUserId: String) {
  updateUserProfileData(
  profileDetails: $profileDetails, targetUserId: $targetUserId, legalDetails: $legalDetails
  ) {
      id
      info {
        salutation
        firstName
        lastName
        mailingAddress {
            street
            city
            state
            zipCode
          }
      }
    }
  }`;

export const requestEmailChnage = gql`
  mutation _requestEmailChange($newEmail: String!) {
    requestEmailChange(
      newEmail: $newEmail
    )
  }`;

export const verifyAndUpdateEmail = gql`
  mutation _verifyAndUpdateEmail($confirmationCode: String! $resourceId: String!) {
    verifyAndUpdateEmail(
      confirmationCode: $confirmationCode
      resourceId: $resourceId
    ){
      email {
        address
      }
    }
  }`;

export const updateUserPhoneDetail = gql`
  mutation _updateUserPhoneDetail($phoneDetails: phoneInput!){
    updateUserPhoneDetails(
      phoneDetails: $phoneDetails,
      ) {
        id
        email {
          address
        }
        phone {
          number
          verified
        }
    }
  }`;

export const isUniqueSSN = gql`
  query isUniqueSSN($ssn: String!) {
    isUniqueSSN(ssn: $ssn) {
      alreadyExists
    }
  }`;

export const portPrequalDataToApplication = gql`
  mutation portPrequalDataToApplication($prequalApplicationData: PrequalApplicationInput!) {
    portPrequalDataToApplication(
      prequalApplicationData: $prequalApplicationData
    ){
      id
    }
  }`;

export const requestOtp = gql`
  mutation requestOtp($userId: String $type: MFAModeEnum, $address: String){
    requestOtp(
      userId: $userId
      type: $type
      address: $address
    )
  }`;

export const verifyOtp = gql`
  mutation verifyOtp($resourceId: String! $verificationCode: String!){
    verifyOtp(
      resourceId: $resourceId
      verificationCode: $verificationCode
    )
  }
`;

export const requestOtpWrapper = gql`
  mutation requestOTPWrapper($address: String!, $firstName: String){
    requestOTPWrapper(
      address: $address
      firstName: $firstName
    )
  }
`;

export const verifyOTPWrapper = gql`
  mutation verifyOTPWrapper($verifyOTPData: VerifyOTPInput!){
    verifyOTPWrapper(
      verifyOTPData: $verifyOTPData
    )
  }
`;

export const checkEmailExistsPresignup = gql`
  query checkEmailExistsPresignup($email: String!){
    checkEmailExistsPresignup(email: $email)
  }
`;

export const checkMigrationByEmail = gql`
  mutation checkMigrationByEmail($migrationByEmailData: CheckMigrationByEmailInput!) {
    checkMigrationByEmail(migrationByEmailData: $migrationByEmailData)
 }`;

export const checkValidAddress = gql`
  query checkValidInvestorAddress($street: String!, $city: String!, $state: String!, $zipCode: String!, $streetTwo: String!) {
    checkValidInvestorAddress(
      street: $street,
      city: $city,
      state: $state,
      zipCode: $zipCode,
      streetTwo: $streetTwo
    ){
      valid
      message
    }
  }
`;
