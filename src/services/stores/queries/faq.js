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
