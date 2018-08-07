import gql from 'graphql-tag';

export const allInsightArticles = gql`
query insights{
  insightsArticles{
    id
    content
    featureImage
    minuteRead
    title
    author
    updatedDate
    createdDate
    category
    articleStatus
    banner
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
    featureImage
    minuteRead
    title
    author
    updatedDate
    createdDate
    category
    articleStatus
    banner
  }
}
`;
