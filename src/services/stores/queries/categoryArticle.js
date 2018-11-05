import gql from 'graphql-tag';

export const getCategoryList = gql`
query _getCategory($categoryType: CategoryTypeEnum!) {
  categories(categoryType:$categoryType) {
    categoryName
    id
  }
}
`;
