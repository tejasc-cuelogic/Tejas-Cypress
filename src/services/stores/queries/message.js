import gql from 'graphql-tag';

export const offeringCommentsByOfferId = gql`
  query _offeringCommentsByOfferId($offerId: String!) {
  offeringCommentsByOfferId (offerId: $offerId) {
    id
    offeringId
    thread
    comment
    scope
    created {
      id
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
      }
    }
    threadComments {
    id
    comment
    scope
    created {
      id
      by
      date
    }
    approved {
      id
      by
      date
    }
    updated {
      id
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
      }
    }
  }
  }
}
`;

export const deleteMessage = gql`
  mutation _deleteOfferingComments($id: [String]) {
    deleteOfferingComments(id: $id)
  }
`;

export const createOfferingComments = gql`
  mutation _createOfferingComments($commentInput: OfferingCommentsInput!) {
  createOfferingComments (
    commentInput: $commentInput
  ) {
    id
  }
}
`;

export const offeringCommentsApprovedByInfo = gql`
  mutation _offeringCommentsApprovedByInfo($id: String!) {
    offeringCommentsApprovedByInfo (
    id: $id
  ) {
    id
  }
}
`;

export const updateOfferingCommentsInfo = gql`
  mutation _updateOfferingCommentsInfo($id: String!, $commentInput: OfferingCommentsInput!) {
    updateOfferingCommentsInfo (
      id: $id
      commentInput: $commentInput
  ) {
    id
  }
}
`;
