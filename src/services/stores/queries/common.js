import gql from 'graphql-tag';

export const createUploadEntry = gql`
  mutation createUploadEntry($applicationId:String, $applicationIssuerId:String, $stepName: stepsEnum!, $userRole: UserRoleEnum!, $fileData: UploadFileMetaInput!, $offeringId: String, $tags: [String]) {
    createUploadEntry(applicationId: $applicationId, applicationIssuerId: $applicationIssuerId, stepName: $stepName, userRole: $userRole, fileData: $fileData, offeringId: $offeringId, tags: $tags) {
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

export const updateUserReferralCode = gql`
mutation _updateUserReferralCode($cognitoUserId: String!, $referralCode: String!) {
  updateUserReferralCode (
    cognitoUserId: $cognitoUserId
    referralCode: $referralCode
  )
}`;

export const getBoxFileDetails = gql`
  query getFileDetails($fileId: String!) {
    getFileDetails (fileId: $fileId) {
      boxFileId
    }
  }
`;

export const createCdnSignedUrl = gql`
  mutation _createCdnSignedUrl($key: String!){
    createCdnSignedUrl(
      key: $key
    )
  }
`;
export const deleteCdnS3File = gql`
mutation _deleteCdnS3File($key: String!){ 
  deleteCdnS3File(
    key: $key
  )
}
`;

export const subscribeToNewsLetter = gql`
mutation subscribeToNewsLetterNotifyAdmin($subscriberName: String!, $emailAddress: String!){ 
  subscribeToNewsLetterNotifyAdmin(
    subscriberName: $subscriberName
    emailAddress: $emailAddress
  )
}
`;

export const notifyAdmins = gql`
mutation sendAlertToAdminFromClient($emailContent: String!){ 
  sendAlertToAdminFromClient(
    type: BUG
    emailContent: $emailContent
  )
}
`;
