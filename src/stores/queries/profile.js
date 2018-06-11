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
  mutation updateUserCIPInfo($userId: String! $user: userCIPInput! $phoneDetails: phoneInput! $cipStatus: CipStatusInput!) {
    updateUserCIPInfo(userId: $userId user: $user phoneDetails: $phoneDetails cipStatus: $cipStatus) {
      id
      email
      firstName
      lastName
      lastLoginDate
      accreditation
    }
  }`;

export const updateUserProfileData = gql`
  mutation _updateUserProfileData($userId: String! $profileDetails: UserProfileInput!) {
  updateUserProfileData(
  userId: $userId
  profileDetails: $profileDetails
  ) {
      id
      firstName
      lastName
      address {
        mailing {
          street
          city
          state
          zipCode
        }
        residence {
          street
          }
        }
      }
  }`;

export const requestEmailChnage = gql`
  mutation _requestEmailChange($userId: String! $newEmail: String!) {
    requestEmailChange(
      userId: $userId
      newEmail: $newEmail
    )
  }`;

export const verifyAndUpdateEmail = gql`
  mutation _verifyAndUpdateEmail($userId: String! $confirmationCode: String!) {
    verifyAndUpdateEmail(
      userId: $userId
      confirmationCode: $confirmationCode
    ){
      id
      email
    }
  }`;

export const updateUserPhoneDetail = gql`
  mutation _updateUserPhoneDetail($phoneDetails: phoneInput! $userId: String!){
    updateUserPhoneDetails(
      phoneDetails: $phoneDetails,
      userId: $userId
      ) {
      id
      email
      contactDetails{
        phone {
          number
          countryCode
          verificationDate
        }
      }
    }
  }`;

export const createUploadEntry = gql`
  mutation createUploadEntry($userId:String!, $stepName: stepsEnum!, $fileData: UploadFileMetaInput!) {
    createUploadEntry(userId: $userId, stepName: $stepName, fileData: $fileData) {
      preSignedUrl
      fileId
    }
  }`;

export const removeUploadedFile = gql`
  mutation removeFile($fileId:String!) {
    removeFile(fileId: $fileId) {
      preSignedUrl
      fileId
    }
  }`;
