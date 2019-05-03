import gql from 'graphql-tag';

export const faqs = gql`
  query faqs {
    faqs {
      id
      slug
      author
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
      author
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

export const deleteFaq = gql`
  mutation deleteFaq($id: [String]){
    deleteFaq(id: $id)
  }
`;

export const upsertFaq = gql`
  mutation upsertFaq ($faqInput: FaqItemInput) {
    upsertFaq ( faqInput: $faqInput ) {
      id
      slug
      author
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
      author
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
export const updateStatus = gql`
  mutation updateStatus($id: [String]!, $itemStatus:ArticleStatusEnum!){
    updateStatus(id: $id, itemStatus:$itemStatus)
}  
`;
