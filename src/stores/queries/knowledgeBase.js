import gql from 'graphql-tag';

export const allKbsQuery = gql`
  query getknowledgeBase($scopeType: KnowledgeBaseTypeEnum!) {
    knowledgeBase(scopeType: $scopeType) {
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
  query getFaqs($scopeType: FaqTypeEnum!) {
    faqs(scopeType: $scopeType) {
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
