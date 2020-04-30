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

export const getCollection = gql`
query getCollection($slug: String!) {
  getCollection(slug: $slug) {
    id
    name
    slug
    status
    marketing {
      tombstone {
        image {
          url
          isPublic
        }
        bgImage {
          url
          isPublic
        }
        bgColor
        title
        description
        tag {
          color
          text
        }
      }
      content {
        contentType
        customValue
        order
        scope
        title
        meta
      }
    }
  }
}`;
