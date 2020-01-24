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
      order
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const adminGetFaqById = gql`
  query adminGetFaqById ($id: String!) {
    adminGetFaqById (id: $id) {
      id
      slug
      author
      question
      categoryId
      categoryName
      answer
      faqType
      order
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const adminDeleteFaq = gql`
  mutation adminDeleteFaq($ids: [String]){
    adminDeleteFaq(ids: $ids)
  }
`;

export const adminUpsertFaq = gql`
  mutation adminUpsertFaq ($faqInput: FaqItemInput) {
    adminUpsertFaq ( faqInput: $faqInput ) {
      id
      slug
      author
      question
      categoryName
      answer
      faqType
      itemStatus
      order
      updated{
        by
        date
      }
    }
  }
`;

export const adminFaqsListByFilters = gql`
  query adminFaqsListByFilters ($question: String, $faqType: FaqTypesEnum, $categoryId: String, $itemStatus: ArticleStatusEnum){
    adminFaqsListByFilters (question: $question, faqType: $faqType, categoryId: $categoryId, itemStatus: $itemStatus){
      id
      slug
      author
      question
      categoryName
      answer
      order
      faqType
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const adminSetOrderForFAQ = gql`
mutation adminSetOrderForFAQ($faqItemsList: [FaqOrderInput]) {
  adminSetOrderForFAQ(faqItemsList: $faqItemsList)
}`;
