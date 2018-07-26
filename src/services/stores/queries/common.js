import gql from 'graphql-tag';

export const createUploadEntry = gql`
  mutation createUploadEntry($stepName: stepsEnum!, $userRole: UserRoleEnum! $fileData: UploadFileMetaInput! $applicationId: String) {
    createUploadEntry(stepName: $stepName, userRole: $userRole, fileData: $fileData, applicationId: $applicationId) {
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
