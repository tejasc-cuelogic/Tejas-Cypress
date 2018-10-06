import gql from 'graphql-tag';

export const allKbsQuery = gql`
query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
    id
    categoryName
    knowledgeBaseItemList {
      id
      title
      content
      order
    }
  }
}
`;

export const allFaqQuery = gql`query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
  id
  categoryName
  faqItems {
    id
    question
    answer
    order
  }
  }
}
`;
