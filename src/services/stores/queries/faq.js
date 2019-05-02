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
      categoryId
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

export const faqsListByFilters = gql`
  query faqsListByFilters ($question: String, $faqType: FaqTypesEnum, $categoryId: String, $itemStatus: ArticleStatusEnum){
    faqsListByFilters (question: $question, faqType: $faqType, categoryId: $categoryId, itemStatus: $itemStatus){
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

export const setMemberOrderInTeam = gql`
mutation setMemberOrderInTeam($teamDetails: [TeamOrderInput]) {
  setMemberOrderInTeam(teamDetails: $teamDetails)
}
`;
