import gql from 'graphql-tag';

export const getCategoryList = gql`
query _getCategory {
  categories {
    categoryName
    id
  }
}
`;
