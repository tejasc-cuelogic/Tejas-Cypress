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
      order
      itemStatus
      updated{
        by
        date
      }
    }
  }
`;

export const deleteFaq = gql`
  mutation deleteFaq($ids: [String]){
    deleteFaq(ids: $ids)
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
      order
      updated{
        by
        date
      }
    }
  }
`;
