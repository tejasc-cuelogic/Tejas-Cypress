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

export const updateOfferingRepaymentsMeta = gql`
mutation updateOfferingRepaymentsMeta($audit: Boolean!, $offeringId: String){
    updateOfferingRepaymentsMeta(audit: $audit, offeringId: $offeringId) {
      offeringId
      currentRepaidAmount
      count
    }  
}`;

export const processFullInvestorAccount = gql`
mutation processFullInvestorAccount($userId: String!, $accountId: String!, $createRSAccount: Boolean!, $createInitialDeposit: Boolean!, $sendEmailToInvestor: Boolean!) {
  processFullInvestorAccount(
    userId: $userId,
    accountId: $accountId,
    createRSAccount: $createRSAccount, 
    createInitialDeposit: $createInitialDeposit,
    sendEmailToInvestor: $sendEmailToInvestor,
  )
}`;
