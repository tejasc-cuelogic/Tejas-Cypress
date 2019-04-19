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

export const getAllKnowledgeBaseByFilters = gql`query knowledgeBaseByFilters($title: String, $categoryId: String, $itemStatus: ArticleStatusEnum, $authorId: String){
    knowledgeBaseByFilters(title: $title, categoryId: $categoryId, itemStatus: $itemStatus, authorId: $authorId){
      title
      id
      userType
      itemStatus
      slug      
      updated{
        date
      }
    }
  }  
`;

export const getAllKnowledgeBase = gql`query{
  knowledgeBaseItems{
    title
    id
    userType
    itemStatus
    slug      
    updated{
      date
    }
  }
}
`;

export const getArticlesByCatId = gql`
query _getArticleByCategoryId($id:ID! ) {
  insightArticlesByCategoryId (
    id: $id
  ) {
    id
    content
    featuredImage
    minuteRead
    title
    authorId
    updated {
      date
    }
    created {
      date
    }
    banner
  }
}
`;
export const getArticleById = gql`
query knowledgeBaseById($id: ID!) {
  knowledgeBaseById(id: $id) {
      id
      title
      content
      userType
      itemStatus
      categoryName
  }
}
`;

export const getArticleDetails = gql`
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

export const getArticleDetailsBySlug = gql`
query insightArticleBySlug($slug:String ) {
  insightArticleBySlug(slug: $slug){
    id
    title
    featuredImage
    content
  }
}
`;

export const createArticle = gql`
mutation createArticle($payload:  InsightsArticleInput!, $isPartial: Boolean) {
  createArticle(articleDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    articleStatus
    category
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
    userType
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
  }
}
`;

export const deleteKBById = gql`
  mutation deleteKnowledgeBaseItems($id: [ID]){
    deleteKnowledgeBaseItems(id: $id)
  }
`;

