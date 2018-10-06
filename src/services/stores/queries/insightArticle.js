import gql from 'graphql-tag';

export const allInsightArticles = gql`
query insights{
  insightsArticles{
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
