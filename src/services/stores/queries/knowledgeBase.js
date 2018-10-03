import gql from 'graphql-tag';

export const allKbsAndFaqsQuery = gql`
query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
    id
    categoryName
    knowledgeBaseItemList {
      id
      title
      content
    }
  }
}
`;
