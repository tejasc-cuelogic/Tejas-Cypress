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

export const createCategory = gql`
mutation createCategory($categoryDetailsInput: CategoryInput!) {
  createCategory(categoryDetailsInput: $categoryDetailsInput){
    id
  }
}
`;

export const updateCategoryInfo = gql`
mutation updateCategoryInfo($id: ID!, $categoryDetailsInput: CategoryInput!) {
  updateCategoryInfo(id: $id, categoryDetailsInput: $categoryDetailsInput) {
     id: id,
   }
 }
`;

export const updateCategoryStaus = gql`
mutation updateCategoryStaus($id: ID!, $isPublished: Boolean) {
  updateCategoryStaus(id: $id, isPublished: $isPublished) {
    id
  }
}
`;

export const deleteCategory = gql`
mutation deleteCat($id: ID!) {
  deleteCategory(id: $id) 
}
`;