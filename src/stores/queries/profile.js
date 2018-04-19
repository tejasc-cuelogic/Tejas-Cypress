import gql from 'graphql-tag';

export const verifyCIPUser = gql`
  mutation verifyCIPUsers($userId: String! $user: verifyCIPUsersInput) { 
    verifyCIPIdentity(userId: $userId, user: $user)
  }`;
