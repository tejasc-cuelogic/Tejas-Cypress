import gql from 'graphql-tag';

export const allKbsQuery = gql`
query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
    id
    categoryName
    order
    knowledgeBaseItemList {
      id
      title
      content
      order
      slug
    }
  }
}
`;

export const allFaqQuery = gql`query getListOfFAQsAndKnowledgeBase($categoryType: CategoryTypeEnum!) {
  faqAndKnowledgeBaseItems (categoryType: $categoryType) {
  id
  categoryName
  order
  faqItems {
    id
    question
    answer
    order
    slug
  }
  }
}
`;

export const adminFilterKnowledgeBase = gql`query adminFilterKnowledgeBase($title: String, $categoryId: String, $itemStatus: ArticleStatusEnum, $authorName: String){
    adminFilterKnowledgeBase(title: $title, categoryId: $categoryId, itemStatus: $itemStatus, authorName: $authorName){
      title
      id
      userType
      itemStatus
      slug      
      updated{
        date
      },
      categoryId,
      authorName,
      categoryName,
      order,
    }
  }  
`;

export const adminKnowledgeBaseById = gql`
query adminKnowledgeBaseById($id: ID!) {
  adminKnowledgeBaseById(id: $id) {
      id
      title
      content
      userType
      itemStatus
      categoryName,
      categoryId,
      authorName,
      order,
      slug
  }
}
`;

export const adminKnowledgeBaseById = gql`
query adminKnowledgeBaseById ($id: ID!) {
    adminKnowledgeBaseById (id: $id) {
      id
      title
      content
      userType
      itemStatus
      categoryName
    }
  }
`;

export const adminCreateKnowledgeBaseItem = gql`
mutation adminCreateKnowledgeBaseItem($payload:  KnowledgeBaseItem!, $isPartial: Boolean) {
  adminCreateKnowledgeBaseItem(knowledgeBaseDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    content
    itemStatus,
    categoryName
    userType,
    authorName,
    order,
    slug,
  }
}
`;

export const adminUpdateKnowledgeBaseItem = gql`
mutation adminUpdateKnowledgeBaseItem($id:ID!,$payload:  KnowledgeBaseItem!, $isPartial: Boolean) {
  adminUpdateKnowledgeBaseItem(id:$id,knowledgeBaseDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    content
    itemStatus
    categoryName
    userType
    authorName,
    order,
    slug,
  }
}
`;

export const adminDeleteKnowledgeBaseItems = gql`
  mutation adminDeleteKnowledgeBaseItems($id: [ID]){
    adminDeleteKnowledgeBaseItems(id: $id)
  }
`;

export const adminSetOrderForKnowledgeBase = gql`mutation adminSetOrderForKnowledgeBase($knowledgeBaseItemsList: [KnowledgeBaseOrderInput]) {
  adminSetOrderForKnowledgeBase(knowledgeBaseItemsList: $knowledgeBaseItemsList)
}
`;
