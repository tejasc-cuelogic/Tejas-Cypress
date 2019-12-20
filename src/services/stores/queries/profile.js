import gql from 'graphql-tag';

export const updateUserProfileData = gql`
  mutation updateUserProfileData($profileDetails: UserInfoInput!, $legalDetails: ProfileDataLegalInput, $preferredInfo: PreferredInfoInput, $capabilities: [String], $targetUserId: String) {
  updateUserProfileData(
  profileDetails: $profileDetails, userId: $targetUserId, legalDetails: $legalDetails, preferredInfo: $preferredInfo, capabilities: $capabilities
  ) {
      id
      info {
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
  mutation requestEmailChange($newEmail: String!) {
    requestEmailChange(
      newEmail: $newEmail
    )
  }`;

export const verifyAndUpdateEmail = gql`
  mutation verifyAndUpdateEmail($confirmationCode: String! $resourceId: String!) {
    verifyAndUpdateEmail(
      confirmationCode: $confirmationCode
      resourceId: $resourceId
    ){
      email {
        address
      }
    }
  }`;

export const isUniqueSSN = gql`
  query isUniqueSSN($ssn: String!) {
    isUniqueSSN(ssn: $ssn) {
      alreadyExists
    }
  }`;

export const verifyCip = gql`
  mutation verifyCip($userId: String, $user: UserCIPInput, $phoneDetails: phoneInput!, $isCipOffline: Boolean){
    verifyCip(userId: $userId, user: $user, phoneDetails: $phoneDetails, isCipOffline: $isCipOffline)
  }`;

export const verifyCipSoftFail = gql`
  mutation verifyCipSoftFail($answers: [CIPAnswerInput]){
    verifyCipSoftFail(answers: $answers)
  }`;

export const verifyCipHardFail = gql`
mutation verifyCipHardFail($license: String!, $residence: String!) {
    verifyCipHardFail(
      license: $license
      residence: $residence
    )
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
  mutation requestOtp($type: MFAModeEnum, $address: String){
    requestOtp(
      type: $type
      address: $address
    )
  }`;

export const verifyOtp = gql`
  mutation verifyOtp($resourceId: String! $verificationCode: String!, $isEmailVerify: Boolean, $isPhoneNumberUpdated: Boolean){
    verifyOtp(
      resourceId: $resourceId
      verificationCode: $verificationCode
      isEmailVerify: $isEmailVerify
      isPhoneNumberUpdated: $isPhoneNumberUpdated
    )
  }
`;

export const requestOtpWrapper = gql`
  mutation requestOTPWrapper($address: String!, $firstName: String, $tags: tagsInput){
    requestOTPWrapper(
      address: $address
      firstName: $firstName
      tags: $tags
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
    checkEmailExistsPresignup(email: $email) {
      isEmailExits
      roles
    }
  }
`;
