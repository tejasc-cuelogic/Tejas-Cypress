import gql from 'graphql-tag';

export const allTeamMembers = gql`
  query getMembers {
    teamMembers {
      id
      memberName
      avatar
      story
      title
      heroImage
      social {
        type
        url
      }
      order
      isPublished
    }
  }
`;

export const adminGetTeamMemberById = gql`
  query adminGetTeamMemberById ($id: ID!) {
    adminGetTeamMemberById (id: $id) {
      id
      memberName
      avatar
      story
      title
      heroImage
      social {
        type
        url
      }
      order
    }
  }
`;

export const adminDeleteTeamMember = gql`
  mutation adminDeleteTeamMember($id: [ID]){
    adminDeleteTeamMember(id: $id)
  }
`;

export const adminCreateTeamMember = gql`
  mutation adminCreateTeamMember ($teamMemberDetailsInput: TeamMemberInput!) {
    adminCreateTeamMember ( teamMemberDetailsInput: $teamMemberDetailsInput ) {
      memberName
      avatar
      story
      title
      heroImage
      social {
        type
        url
      }
      order
    }
  }
`;

export const adminUpdateTeamMemberInfo = gql`
  mutation adminUpdateTeamMemberInfo ($id: ID!, $teamMemberDetailsInput: TeamMemberInput!) {
    adminUpdateTeamMemberInfo (
      id: $id,
      teamMemberDetailsInput: $teamMemberDetailsInput
    ) {
      id
      memberName
      avatar
      story
      title
      heroImage
      social {
        type
        url
      }
      order
      isPublished
    }
  }
`;

export const adminSetMemberOrderInTeam = gql`
mutation adminSetMemberOrderInTeam($teamDetails: [TeamOrderInput]) {
  adminSetMemberOrderInTeam(teamDetails: $teamDetails)
}
`;
