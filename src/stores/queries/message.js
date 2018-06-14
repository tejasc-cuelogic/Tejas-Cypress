import gql from 'graphql-tag';

export const allMessages = gql`
  query allMessages {
    allMessages(orderBy: createdAt_DESC, filter: {deleted: false}){
      id
      subject
      body
      updatedAt
      parentId{
        id
      }
      messageDetails{
        id
        from
        to
        read
      }
    }
  }
`;

export const deleteMessage = gql`
  mutation DeleteMessage($id: ID!) {
    updateMessage( id: $id, deleted: true ) {
      id
    }
  }
`;

export const messageThread = gql`
  query messageThread {
    allMessages(orderBy: createdAt_ASC){
      id
      subject
      body
      updatedAt
      messageDetails{
        from
        to
        read
      }
    }
  }
`;

// (filter:{deletedReceiver_not: true}) , filter: {id: $id} ($id: ID!)
