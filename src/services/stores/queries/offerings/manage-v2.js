import gql from 'graphql-tag';

export const offeringUpsert = gql`
mutation offeringUpsert($id: String, $offeringDetails: OfferingInputObject!) {
  offeringUpsert(id: $id, offeringDetails: $offeringDetails) {
    id
  }
}
`;
