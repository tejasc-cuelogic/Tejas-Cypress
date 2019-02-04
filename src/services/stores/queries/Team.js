import gql from 'graphql-tag';

export const allTeamMembers = gql`
  query _getMembers {
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
    }
  }
`;

export const getTeamMemberById = gql`
  query getTeamMemberById ($id: ID!) {
    getTeamMemberById (id: $id) {
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

export const deleteTeamMemberById = gql`
  mutation deleteTeamMember($id: [ID]){
    deleteTeamMember(id: $id)
  }
`;

export const newTeamMember = gql`
  mutation createTeamMember ($teamMemberDetailsInput: TeamMemberInput!) {
    createTeamMember ( teamMemberDetailsInput: $teamMemberDetailsInput ) {
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

export const editTeamMember = gql`
  mutation updateTeamMemberInfo ($id: ID!, $teamMemberDetailsInput: TeamMemberInput!) {
    updateTeamMemberInfo (
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
    }
  }
`;

export const filteredTeamMembers = gql`
  query filterTeamMemberByMemberName ($memberName: String){
    filterTeamMemberByMemberName (memberName: $memberName){
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
