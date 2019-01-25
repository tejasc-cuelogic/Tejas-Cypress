import gql from 'graphql-tag';

export const getCategories = gql`
query getCategories($type: CategoryTypesEnum!) {
    categories(categoryType: $type) {
      id
      categoryName
      description
      isPublished
      created {
        date
      }
      order
    }
  }
`;

export const createCategory = gql`
mutation createCategory($categoryDetailsInput: CategoryInput!) {
  createCategory(categoryDetailsInput: $categoryDetailsInput){
    id
  }
}
`;
