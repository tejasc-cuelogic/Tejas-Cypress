import gql from 'graphql-tag';

export const allUpdates = gql`
  query _fetchUpdatesByOfferId ($offerId: String!) {
    offeringUpdatesByOfferId (
      offerId: $offerId
    ) {
      id
      title
      updated {
        date
      }
      status
      scope
      content
    }
  }
`;

export const newUpdate = gql`
  mutation _createOfferingUpdates ($updatesInput: OfferingUpdatesInput! ) {
    createOfferingUpdates (updatesInput: $updatesInput) {
      id
    }
  }
`;

export const getUpdate = gql`
  query _fetchOfferingUpdatesById ($id: ID!) {
    offeringUpdatesById (
      id: $id
    ) {
      id
      title
      status
      scope
      content
    }
  }
`;

export const editUpdate = gql`
  mutation _updateOfferingUpdates ($id: ID!, $updatesInput: OfferingUpdatesInput!) {
    updateOfferingUpdatesInfo (
      id: $id,
      updatesInput: $updatesInput
    ) {
      id
      title
    }
  }
`;
