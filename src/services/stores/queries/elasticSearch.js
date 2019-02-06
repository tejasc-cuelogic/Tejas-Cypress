import gql from 'graphql-tag';

export const createUploadEntry = gql`
  mutation createUploadEntry($applicationId:String, $applicationIssuerId:String, $stepName: stepsEnum!, $userRole: UserRoleEnum!, $fileData: UploadFileMetaInput!, $offeringId: String, $tags: [String]) {
    createUploadEntry(applicationId: $applicationId, applicationIssuerId: $applicationIssuerId, stepName: $stepName, userRole: $userRole, fileData: $fileData, offeringId: $offeringId, tags: $tags) {
      preSignedUrl
      fileId
    }
  }`;
