import gql from 'graphql-tag';

export const allOfferings = gql`
  query allOffering2s{
    allOffering2s {
      id
      campaignName
      createdAt
      launchedDate
      lead
      pocEmail
      pocName
      pocPhone
      status
    }
  }
`;

export const deleteOffering = gql`
  mutation deleteOffering2($id: ID!) {
    deleteOffering2(id: $id) {
      id
    }
  }
`;
