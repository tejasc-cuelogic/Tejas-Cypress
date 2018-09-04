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

export const getUpdate = gql`
  query oneUpdate($id: ID) {
    Update(id: $id) {
      id
      createdAt
      title
      status
      lastUpdate
      description
    }
  }
`;

export const editUpdate = gql`
  mutation UpdateUpdate($id: ID!, $title: String!, $lastUpdate: String!, $status: String!, $description: String!){
    updateUpdate(id: $id, title: $title, lastUpdate: $lastUpdate, status: $status, description: $description) {
      id
      title
      status
      lastUpdate
      description
    }
  }
`;
