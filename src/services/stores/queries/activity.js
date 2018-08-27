import gql from 'graphql-tag';

export const allActivities = gql`
  query allActivities {
    allActivityHistories(orderBy: createdAt_DESC){
      id
      createdAt
      userName
      title
      comment
    }
  }
`;

export const addActivity = gql`
  mutation CreateActivity($userId: String, $userName: String, $title: String, $comment: String){
    createActivityHistory(userId: $userId, userName: $userName, title: $title, comment: $comment) {
      id
      createdAt
      title
    }
  }
`;
