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

export const cipLegalDocUploads = gql`
  mutation cipLegalDocUploads($license: String!, $residence: String!) {
    cipLegalDocUploads(
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


  export const sendOtp = gql`
  mutation sendOtp($type: OtpTypeEnum!, $method: MFAMethodEnum!, $to: String!){
    sendOtp(
      type: $type
      method: $method
      to: $to
    )
  }`;

export const verifyOtpPhone = gql`
  mutation verifyOtpPhone($resourceId: String! $verificationCode: String!, $phone: String!){
    verifyOtpPhone(
      resourceId: $resourceId
      verificationCode: $verificationCode
      phone: $phone
    )
  }
`;

export const changeLinkedBankRequest = gql`
  mutation changeLinkedBankRequest(
    $resourceId: String!
    $verificationCode: String!
    $accountId: String!
    $plaidPublicToken: String
    $plaidAccountId: String
    $bankRoutingNumber: String
    $bankAccountNumber: String
    $accountType: accountTypeEnum
    $bankName: String
    ){
    changeLinkedBankRequest(
      resourceId: $resourceId
      verificationCode: $verificationCode
      accountId: $accountId
      plaidPublicToken: $plaidPublicToken
      plaidAccountId: $plaidAccountId
      bankRoutingNumber: $bankRoutingNumber
      accountType: $accountType
      bankName: $bankName

    ) {
      lastDigits
      dateRequested
      status
    }
  }
`;

export const changeEmailRequest = gql`
  mutation changeEmailRequest($resourceId: String! $verificationCode: String!){
    changeEmailRequest(
      resourceId: $resourceId
      verificationCode: $verificationCode
    )
  }
`;

export const changePhoneRequest = gql`
  mutation changePhoneRequest($resourceId: String! $verificationCode: String!, $phone: String!){
    changePhoneRequest(
      resourceId: $resourceId
      verificationCode: $verificationCode
    )
  }
`;

export const verifyOtpEmailPrivate = gql`
  mutation verifyOtpEmail($resourceId: String! $verificationCode: String!, $email: String!){
    verifyOtpEmail(
      resourceId: $resourceId
      verificationCode: $verificationCode
      email: $email
    )
  }
`;

export const sendOtpEmail = gql`
  mutation sendOtpEmail($email: String!, $tags: tagsInput){
    sendOtpEmail(
      email: $email
      tags: $tags
    )
  }
`;

export const verifyOtpEmail = gql`
  mutation verifyOtpEmail($verifyOTPData: VerifyOTPEmailInput!){
    verifyOtpEmail(
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
