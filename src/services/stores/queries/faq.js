import gql from 'graphql-tag';

export const faqs = gql`
  query faqs {
    faqs {
      id
      slug
      author{
        info{
          firstName
          lastName
        }
      }
      question
      categoryName
      answer
      faqType
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const getFaqById = gql`
  query getFaqById ($id: String!) {
    getFaqById (id: $id) {
      id
      slug
      author{
        info{
          firstName
          lastName
        }
      }
      question
      categoryName
      answer
      faqType
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const deleteTeamMemberById = gql`
  mutation deleteTeamMember($id: [ID]){
    deleteTeamMember(id: $id)
  }
`;

export const upsertFaq = gql`
  mutation upsertFaq ($faqInput: FaqItemInput) {
    upsertFaq ( faqInput: $faqInput ) {
      id
      slug
      author{
        info{
          firstName
          lastName
        }
      }
      question
      categoryName
      answer
      faqType
      itemStatus
      updated{
        by
        date
      }
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
      isPublished
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

export const setMemberOrderInTeam = gql`
mutation setMemberOrderInTeam($teamDetails: [TeamOrderInput]) {
  setMemberOrderInTeam(teamDetails: $teamDetails)
}
`;
