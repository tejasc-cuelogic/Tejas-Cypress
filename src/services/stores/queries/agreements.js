import gql from 'graphql-tag';

export const getBoxEmbedLink = gql`
  mutation _getBoxEmbedLink($fileId: String!) {
    getBoxEmbedLink (fileId: $fileId)
  }
`;
