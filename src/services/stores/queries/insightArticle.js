import gql from 'graphql-tag';

export const allInsightArticles = gql`
query insights($sortByCreationDateAsc: Boolean!, $categoryId: String){
  getInsightsArticles(sortByCreationDateAsc: $sortByCreationDateAsc, categoryId: $categoryId){
    id
    content
    isFeatured
    category
    featuredImage
    tags
    articleStatus
    minuteRead
    title
    slug
    updated {
      date
    }
    created {
      date
    }
    banner
    createdDate
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
query insight($id: ID!) {
  insightsArticle(id: $id) {
    id
    title
    featuredImage
    content
    category
    tags
    author {
      id
      info {
        lastName
        firstName
      }
    }
    articleStatus
    updated {
      by
      date
      __typename
    }
    __typename
  }
}
`;

export const getArticleDetails = gql`
query insight($id:ID! ) {
  insightsArticleById(id: $id){
    id
    title
    featuredImage
    content
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

export const updateArticle = gql`
mutation updateArticleInfo($id: ID!, $payload:  InsightsArticleInput!, $isPartial: Boolean) {
  updateArticleInfo(id:$id, articleDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    articleStatus
    category
  }
}
`;

