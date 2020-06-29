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

export const adminInsightsArticle = gql`
query adminInsightsArticle($id: ID!) {
  adminInsightsArticle(id: $id) {
    id
    minuteRead
    title
    banner
    featuredImage
    isFeatured
    content
    category
    categoryId
    tags
    author
    slug
    articleStatus
    social {
      type url blurb shareLink
      featuredImageUpload { id url fileName isPublic }
    }
    updated {
      by
      date
    }
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
    author
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
    category
    tags
    social {
      type url blurb shareLink
      featuredImageUpload { id url fileName isPublic }
    }
  }
}
`;

export const adminCreateArticle = gql`
mutation adminCreateArticle($payload:  InsightsArticleInput!, $isPartial: Boolean) {
  adminCreateArticle(articleDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    articleStatus
    category
    slug
    isFeatured
  }
}
`;

export const adminUpdateArticleInfo = gql`
mutation adminUpdateArticleInfo($id: ID!, $payload:  InsightsArticleInput!, $isPartial: Boolean) {
  adminUpdateArticleInfo(id:$id, articleDetailsInput: $payload, isPartialData: $isPartial) {
    id
    title
    articleStatus
    category
    slug
  }
}
`;

export const adminDeleteArticle = gql`
mutation adminDeleteArticle($id: [ID]) {
  adminDeleteArticle(id: $id) 
}
`;

export const adminInsightArticlesListByFilter = gql`
query adminInsightArticlesListByFilter($categoryId: String, $articleStatus: ArticleStatusEnum, $title: String, $tags: [String], $author: String, $fromDate: String, $toDate: String){
  adminInsightArticlesListByFilter(categoryId: $categoryId, articleStatus: $articleStatus, title: $title, tags: $tags, author: $author, fromDate: $fromDate, toDate: $toDate){
    id
    slug
    content
    category
    categoryId
    featuredImage
    tags
    articleStatus
    visible
    minuteRead
    title
    author
    updated {
      date
    }
    isFeatured
    created {
      date
    }
    banner
  }
}
`;
