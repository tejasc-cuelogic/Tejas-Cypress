import gql from 'graphql-tag';

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
