import gql from 'graphql-tag';

export const allInsightArticles = gql`
query insights($sortByCreationDateAsc: Boolean!, $categoryId: String){
  getInsightsArticles(sortByCreationDateAsc: $sortByCreationDateAsc, categoryId: $categoryId){
    id
    content
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

export const getInsightById = gql`
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
    authorId
    category
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

export const deleteArticle = gql`
mutation deleteArticle($id: [ID]) {
  deleteArticle(id: $id) 
}
`;

export const insightArticlesListByFilter = gql`
query insightArticlesListByFilter($categoryId: String, $articleStatus: ArticleStatusEnum, $title: String, $tags: [String], $author: String, $fromDate: String, $toDate: String){
  insightArticlesListByFilter(categoryId: $categoryId, articleStatus: $articleStatus, title: $title, tags: $tags, author: $author, fromDate: $fromDate, toDate: $toDate){
    id
    content
    category
    featuredImage
    tags
    articleStatus
    minuteRead
    title
    author {
      info {
        firstName
        lastName
      }
    }
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

