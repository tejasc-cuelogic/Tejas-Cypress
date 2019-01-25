import gql from 'graphql-tag';

export const getCategories = gql`
query getCategories($types: [CategoryTypesEnum]) {
    categories(categoryType: $types) {
      id
      categoryName
      description
      categoryType
      isPublished
      created {
        date
      }
      order
    }
  }
`;
