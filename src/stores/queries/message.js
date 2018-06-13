import gql from 'graphql-tag';

export const allMessages = gql`
  query allMessages {
    allMessages(orderBy: createdAt_DESC){
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
