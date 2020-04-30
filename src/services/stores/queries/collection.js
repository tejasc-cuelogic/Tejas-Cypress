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
    slug
  }
}`;

export const getCollection = gql`
query getCollection($slug: String, $id: String, $previewPassword: String) {
  getCollection(id: $id, slug: $slug, previewPassword: $previewPassword){
    id
    name
    slug
    previewPassword
    lock{
      id
      by
      date
    }
    marketing {
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

export const adminLockOrUnlockCollection = gql`
mutation adminLockOrUnlockCollection($id: String!, $action: CollectionLockActionEnum!){
  adminLockOrUnlockCollection(
    id: $id,
    action: $action){
    id
    by
    date
    message
  }
}`;

export const adminCollectionMappingUpsert = gql`
mutation adminCollectionMappingUpsert(
  $collectionId: String!
  $referenceId: String!
  $type: CollectionMappingTypeEnum!
  $order: Int
  $scope: ScopeEnumType!){
  adminCollectionMappingUpsert(
    collectionId: $collectionId,
    referenceId: $referenceId,
    type: $type,
    order: $order,
    scope: $scope,
    ) {
      collectionId
      referenceId
      type
      order
      scope
      offering {
        offeringSlug
      }
      insight {
        title
      }
    }
}`;
