import gql from 'graphql-tag';

export const createUploadEntry = gql`
  mutation createUploadEntry($applicationId:String, $applicationIssuerId:String, $stepName: stepsEnum!, $userRole: UserRoleEnum!, $fileData: UploadFileMetaInput!) {
    createUploadEntry(applicationId: $applicationId, applicationIssuerId: $applicationIssuerId, stepName: $stepName, userRole: $userRole, fileData: $fileData) {
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
