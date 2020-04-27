import gql from 'graphql-tag';

export const adminCollectionUpsert = gql`
  mutation adminCollectionUpsert($id: String, $collectionDetails: CollectionInputType!) {
    adminCollectionUpsert(id: $id, collectionDetails: $collectionDetails) {
        id
        name
        slug
        status
        created{
          id
          by
          date
        } 
    }
  }`;

export const getCollections = gql`
query getCollections {
  getCollections{
    id
    name
  }
}`;
