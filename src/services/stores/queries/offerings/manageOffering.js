import gql from 'graphql-tag';

export const offeringUpsert = gql`
mutation offeringUpsert($id: String, $offeringDetails: OfferingInputType!) {
  offeringUpsert(id: $id, offeringDetails: $offeringDetails) {
    offeringSlug
  }
}
`;
