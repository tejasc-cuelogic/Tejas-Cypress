import gql from 'graphql-tag';

const updateField = `
      id
      tiers
      title
      isVisible
      offeringId
      updatedDate
      postUpdateAs
      updated {
        date
        by
      }
      approved {
        by
        date
      }
      status
      scope
      content`;

export const allUpdates = gql`
  query fetchUpdatesByOfferId ($offerId: String!, $userId: String) {
    offeringUpdatesByOfferId (
      offerId: $offerId
      userId: $userId
    ) {
      ${updateField}
    }
  }
`;

export const newUpdate = gql`
  mutation createOfferingUpdates ($updatesInput: OfferingUpdatesInput! ) {
    createOfferingUpdates (updatesInput: $updatesInput) {
      ${updateField}
    }
  }
`;

export const getUpdate = gql`
  query fetchOfferingUpdatesById ($id: ID!) {
    offeringUpdatesById (
      id: $id
    ) {
      ${updateField}
      notificationSent {
        by
        date
        id
        to
      }
    }
  }
`;

export const editUpdate = gql`
  mutation updateOfferingUpdates ($id: ID!, $updatesInput: OfferingUpdatesInput!) {
    updateOfferingUpdatesInfo (
      id: $id,
      updatesInput: $updatesInput
      ) {
        ${updateField}
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
