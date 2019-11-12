import gql from 'graphql-tag';

export const allUpdates = gql`
  query _fetchUpdatesByOfferId ($offerId: String!, $userId: String) {
    offeringUpdatesByOfferId (
      offerId: $offerId
      userId: $userId
    ) {
      id
      title
      isVisible
      offeringId
      updatedDate
      updated {
        date
      }
      approved {
        by
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
      title
      isVisible
      offeringId
      updatedDate
      updated {
        date
      }
      approved {
        by
        date
      }
      status
      scope
      content
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
      updatedDate
      scope
      content
      tiers
      approved {
        by
        date
      }
      updated {
        by
        date
      }
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
      status
      scope
      content
      tiers
      updatedDate
      approved {
        by
        date
      }
      updated {
        by
        date
      }
    }
  }
`;

export const sendOfferingUpdateTestEmail = gql`
mutation sendOfferingUpdateTestEmail($offeringUpdateId: String!, $emailTemplate: publishLiveEmailTemplate!, $shouldSendInvestorNotifications:Boolean!) {
  sendOfferingUpdateTestEmail(
    offeringUpdateId: $offeringUpdateId
    emailTemplate: $emailTemplate
    shouldSendInvestorNotifications:$shouldSendInvestorNotifications
  )
}`;

export const offeringUpdatePublish = gql`
mutation offeringUpdatePublish($id: ID!, $updatesInput: OfferingUpdatesInput!, $emailTemplate: publishLiveEmailTemplate!, $shouldSendInvestorNotifications:Boolean!) {
  offeringUpdatePublish(
    id: $id
    updatesInput: $updatesInput
    emailTemplate: $emailTemplate
    shouldSendInvestorNotifications:$shouldSendInvestorNotifications
  ) {
    id
  }
}`;

export const deleteOfferingUpdate = gql`
mutation deleteOfferingUpdate($id: [ID]) {
  deleteOfferingUpdates(id: $id)
}
`;
