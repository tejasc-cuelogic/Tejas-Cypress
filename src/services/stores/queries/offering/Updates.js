import gql from 'graphql-tag';

export const allUpdates = gql`
  query allUpdates{
    allUpdates(orderBy: createdAt_DESC) {
      id
      createdAt
      updatedAt
      title
      status
      lastUpdate
    }
  }
`;

export const newUpdate = gql`
  mutation CreateUpdate($title: String!, $status: String!, $lastUpdate: String!, $description: String){
    createUpdate(title: $title, status: $status, lastUpdate: $lastUpdate, description: $description) {
      id
      createdAt
      title
      status
      lastUpdate
      description
    }
  }
`;
