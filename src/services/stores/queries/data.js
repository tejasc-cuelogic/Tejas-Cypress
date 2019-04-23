import gql from 'graphql-tag';

export const generateInvestorFolderStructure = gql`
mutation generateInvestorFolderStructure($userId: String!){
    generateInvestorFolderStructure(userId: $userId)  
}`;
