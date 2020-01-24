import gql from 'graphql-tag';

export const getCategories = gql`
query getCategories($types: [CategoryTypeEnum]) {
  categories(categoryType: $types) {
      id
      categoryName
      description
      categoryType
      order
    }
  }`;

export const adminCategories = gql`
query adminCategories($types: [CategoryTypesEnum]) {
    adminCategories(categoryType: $types) {
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
  }`;


export const adminCreateCategory = gql`
mutation adminCreateCategory($categoryDetailsInput: CategoryInput!) {
  adminCreateCategory(categoryDetailsInput: $categoryDetailsInput){
    id
  }
}
`;

export const adminUpdateCategoryInfo = gql`
mutation adminUpdateCategoryInfo($id: ID!, $categoryDetailsInput: CategoryInput!) {
  adminUpdateCategoryInfo(id: $id, categoryDetailsInput: $categoryDetailsInput) {
     id: id,
   }
 }
`;

export const adminUpdateCategoryStatus = gql`
mutation adminUpdateCategoryStatus($id: ID!, $isPublished: Boolean) {
  adminUpdateCategoryStatus(id: $id, isPublished: $isPublished) {
    id
  }
}
`;

export const adminDeleteCategory = gql`
mutation adminDeleteCategory($id: ID!) {
  adminDeleteCategory(id: $id) 
}
`;

export const adminSetCategoryOrderForCategoryType = gql`
mutation adminSetCategoryOrderForCategoryType($categoryDetails: [CategoryOrderInput]) {
  adminSetCategoryOrderForCategoryType(categoryDetails: $categoryDetails)
}
`;
