import gql from 'graphql-tag';

export const allTeamMembers = gql`
  query _getMembers {
    teamMembers {
      id
      memberName
      avatar
      story
      title
      social {
        type
        url
      }
      order
    }
  }
`;
