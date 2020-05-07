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
  query getCollectionMapping($collectionId: String, $referenceId: String, $type: CollectionMappingTypeEnum) {
    getCollectionMapping(
      collectionId: $collectionId
      referenceId: $referenceId
      type: $type
    ) {
      collectionId
      referenceId
      type
      order
      scope
      offering {
        id
        ${common.offeringBasics}
      }
      insight {
        id
        content
        isFeatured
        category
        featuredImage
        tags
        articleStatus
        minuteRead
        title
        slug
        updated {
          date
        }
        created {
          date
        }
        banner
        createdDate
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
        tombstone {
          title
          description
          bgColor
          image {
            id
            url
            isPublic
            fileName
          }
          bgImage {
            id
            url
            isPublic
            fileName
          }
          tag {
            color
            text
          }
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

export const adminDeleteCollectionMapping = gql`
  mutation adminDeleteCollectionMapping($collectionId: String, !$referenceId: String!){
    adminDeleteCollectionMapping(
      collectionId: $collectionId,
      referenceId: $referenceId,
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

export const adminDeleteCollection = gql`
  mutation adminDeleteCollection($id: String!){
    adminDeleteCollection (id: $id) {
      id
      name
    }
  }`;
