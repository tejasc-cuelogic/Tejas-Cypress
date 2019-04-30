import gql from 'graphql-tag';

export const generateInvestorFolderStructure = gql`
mutation generateInvestorFolderStructure($userId: String!){
    generateInvestorFolderStructure(userId: $userId)  
}`;


export const storageDetailsForInvestor = gql`
mutation storageDetailsForInvestor($limit: Int = 0) {
    storageDetailsForInvestor(limit: $limit) {
      count
      createdCount
    }
  }`;
