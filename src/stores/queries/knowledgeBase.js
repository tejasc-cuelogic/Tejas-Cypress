import gql from 'graphql-tag';

export const allKbsQuery = gql`
  query getknowledgeBase {
    knowledgeBase(scopeType: INVESTOR) {
      id
      title
      knowledgeBaseItems {
        id
        title
        body
      }
    }
  }
`;

export const allFaqQuery = gql`
  query getFaqs {
    faqs(scopeType: INVESTOR) {
      id
      question
      faqItems {
        id
        question
        answer
      }
    }
  }
`;
