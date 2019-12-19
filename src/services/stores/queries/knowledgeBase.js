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

export const getAllKnowledgeBaseByFilters = gql`query knowledgeBaseByFilters($title: String, $categoryId: String, $itemStatus: ArticleStatusEnum, $authorName: String){
    knowledgeBaseByFilters(title: $title, categoryId: $categoryId, itemStatus: $itemStatus, authorName: $authorName){
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

export const getKnowledgeBaseById = gql`
query knowledgeBaseById($id: ID!) {
  knowledgeBaseById(id: $id) {
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

export const getKnowledgeBaseDetails = gql`
query knowledgeBaseById ($id: ID!) {
    knowledgeBaseById (id: $id) {
      id
      title
      content
      userType
      itemStatus
      categoryName
    }
  }
`;

export const createKnowledgeBase = gql`
mutation createKnowledgeBaseItem($payload:  KnowledgeBaseItem!, $isPartial: Boolean) {
  createKnowledgeBaseItem(knowledgeBaseDetailsInput: $payload, isPartialData: $isPartial) {
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

export const updateKnowledgeBase = gql`
mutation updateKnowledgeBaseItem($id:ID!,$payload:  KnowledgeBaseItem!, $isPartial: Boolean) {
  updateKnowledgeBaseItem(id:$id,knowledgeBaseDetailsInput: $payload, isPartialData: $isPartial) {
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

export const deleteKBById = gql`
  mutation deleteKnowledgeBaseItems($id: [ID]){
    deleteKnowledgeBaseItems(id: $id)
  }
`;

export const setOrderForKnowledgeBase = gql`mutation setOrderForKnowledgeBase($knowledgeBaseItemsList: [KnowledgeBaseOrderInput]) {
  setOrderForKnowledgeBase(knowledgeBaseItemsList: $knowledgeBaseItemsList)
}
`;
