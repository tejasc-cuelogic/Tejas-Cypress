import gql from 'graphql-tag';

export const allKbsQuery = gql`
query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
    id
    categoryName
    knowledgeBaseItemList {
      id
      title
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
