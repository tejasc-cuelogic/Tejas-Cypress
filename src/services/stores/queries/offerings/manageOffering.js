import gql from 'graphql-tag';

export const offeringUpsert = gql`
mutation offeringUpsert($id: String, $offeringDetails: OfferingInputType!) {
  offeringUpsert(id: $id, offeringDetails: $offeringDetails) {
    offeringSlug
  }
}
`;

export const adminLockOrUnlockOffering = gql`
mutation adminLockOrUnlockOffering($offeringId: String!, $action: OfferingLockActionEnumType!) {
  adminLockOrUnlockOffering(offeringId: $offeringId, action: $action) {
    date
    user
    userId
    message
  }
}
`;

export const adminGetInvestNowMappings = gql`
query _adminGetInvestNowMappings {
  adminGetInvestNowMappings {
    label
    value
  }
}
`;
