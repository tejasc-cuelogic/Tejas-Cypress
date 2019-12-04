import gql from 'graphql-tag';

export const offeringCommentsByOfferId = gql`
  query offeringCommentsByOfferId($offerId: String!) {
  offeringCommentsByOfferId (offerId: $offerId) {
    id
    offeringId
    thread
    comment
    scope
    created {
      by
      date
    }
    approved {
      id
      by
      date
    }
    updated {
      by
      date
    }
    createdUserInfo {
      id
      info {
        firstName
        lastName
        avatar {
          url
          name
        }
      }
      roles {
        name
        scope
      }
    }
    threadComments {
    id
    comment
    scope
    created {
      by
      date
    }
    approved {
      id
      by
      date
    }
    updated {
      by
      date
    }
    createdUserInfo {
      id
      info {
        firstName
        lastName
        avatar {
          url
          name
        }
      }
      roles {
        name
        scope
      }
    }
  }
  }
}
`;

export const deleteMessage = gql`
  mutation deleteOfferingComments($id: [String]) {
    deleteOfferingComments(id: $id)
  }
`;

export const createOfferingComments = gql`
  mutation createOfferingComments($commentInput: OfferingCommentsInput!) {
  createOfferingComments (
    commentInput: $commentInput
  ) {
    id
  }
}
`;

export const offeringCommentsApprovedByInfo = gql`
  mutation offeringCommentsApprovedByInfo($id: String!) {
    offeringCommentsApprovedByInfo (
    id: $id
  ) {
    id
  }
}
`;

export const updateOfferingCommentsInfo = gql`
  mutation updateOfferingCommentsInfo($id: String!, $commentInput: OfferingCommentsInput!) {
    updateOfferingCommentsInfo (
      id: $id
      commentInput: $commentInput
  ) {
    id
  }
}
`;
