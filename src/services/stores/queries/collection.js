import gql from 'graphql-tag';
import { offeringFields } from './campagin';
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

export const getPublicCollectionMapping = gql`
query getCollectionMapping($collectionId: String!) {
  getCollectionMapping(collectionId: $collectionId) {
    collectionId
    referenceId
    type
    scope
    order
    offering {
      ${offeringFields}
    }
    insight {
      id
      # content
      category
      featuredImage
      minuteRead
      title
      slug
    }
  }
}`;

export const getCollections = gql`
  query getCollections {
    getCollections{
      id
      name
      slug
      status
      order
    }
  }`;

export const allOfferings = gql`
  query getOfferingList($filters: OfferingListFilterInputType){
      getOfferingList(filters: $filters) {
        offeringSlug
        stage
        id
        isAvailablePublicly
        keyTerms {
          targetInvestmentPeriod
          regulation
          shorthandBusinessName
          legalBusinessName
          securities
        }
      }
    }
  `;


export const adminSetOrderForCollection = gql`
  mutation adminSetOrderForCollection($collectionItemsList: [CollectionOrderInput]){
    adminSetOrderForCollection(
      collectionItemsList: $collectionItemsList,
    )
  }`;

export const adminSetOrderForCollectionMapping = gql`
  mutation adminSetOrderForCollectionMapping($collectionMappingItems: [CollectionMappingOrderInput]){
    adminSetOrderForCollectionMapping(
      collectionMappingItems: $collectionMappingItems,
    )
  }`;

export const getPublicCollections = gql`
query getCollections {
  getCollections{
    id
    name
    slug
    order
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
        descriptionColor
        tag {
          color
          text
          textColor
        }
      }
    }
  }
}`;

export const getPublicCollection = gql`
query getCollection($slug: String!) {
  getCollection(slug: $slug) {
    id
    name
    slug
    status
    marketing {
      header {
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
        actionText
        descriptionColor        
        tag {
          color
          text
          textColor
        }
        social {
          type
          url
        }
      }
      content {
        contentType
        customValue
        order
        scope
        title
        meta
        description
      }
      social {
        type
        shareLink
        blurb
        featuredImageUpload {
          url          
        }
      }
    }
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
          description
        }
        tombstone {
          title
          description
          descriptionColor
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
            textColor
          }
        }
        header {
        title
        description
        descriptionColor
        bgColor
        actionText
        social {
          type
          url
        }
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
          textColor
        }
      }
      social {
        type
        shareLink
        blurb
        featuredImageUpload {
          url          
          fileName
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
