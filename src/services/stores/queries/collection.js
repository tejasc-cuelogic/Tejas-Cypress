import gql from 'graphql-tag';
import { common } from './offerings/manage';

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

export const getCollectionMapping = gql`
  query getCollectionMapping($collectionId: String!, $type: CollectionMappingTypeEnum) {
    getCollectionMapping(
      collectionId: $collectionId
      type: $type
      # referenceId: "030a5595-a5a2-4140-b65a-d74c063838bf" # Optional, use it if you want to fetch a single collection mapping
      # type: OFFERING # optional, use it if you want to filter mappings by type
      # scope: PUBLIC # optional, use it if you want to filter mappings by scope
      # challenge: "nextseed" # optional, use it if you want to unlock LOCKED mappings for non-admins
    ) {
      collectionId
      referenceId
      type
      order
      scope
      offering {
        ${common.offeringBasics}
      }
      insight {
        title
        # ... any insight article details you want to retrieve (will only be available if mapping's type is INSIGHT
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
