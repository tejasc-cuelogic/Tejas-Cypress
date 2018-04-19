import gql from 'graphql-tag';

export const verifyCIPUser = gql`
  mutation verifyCIPUsers($userId: String! $user: verifyCIPUsersInput) { 
    verifyCIPIdentity(userId: $userId, user: $user) {
      ... on UserCIPSoftFail{
        softFailId: id
        key
        message
        qualifiers {
          key
          message
        }
        questions {
          prompt
          type
          choices {
            text
          }
        }
      }
      
      ... on UserCIPHardFail{
        hardFailId: id
        key
        message
        qualifiers {
          key
          message
        }
      }
      
      ... on UserCIPPass {
        passId: id
        key
        message
        summary
      }
    }
  }`;
