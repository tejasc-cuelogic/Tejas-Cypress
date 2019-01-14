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
