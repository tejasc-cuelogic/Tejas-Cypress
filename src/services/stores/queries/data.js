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
mutation processFullInvestorAccount($userId: String!, $accountId: String!, $createRSAccount: Boolean!, $createInitialDeposit: Boolean!, $sendEmailToInvestor: Boolean!, $createGsContactAccount: Boolean!, $createAccountPdf: Boolean!, $sendCrowdPayEmailToGS: Boolean!) {
  processFullInvestorAccount(
    userId: $userId,
    accountId: $accountId,
    createRSAccount: $createRSAccount, 
    createInitialDeposit: $createInitialDeposit,
    sendEmailToInvestor: $sendEmailToInvestor,
    createGsContactAccount: $createGsContactAccount,
    createAccountPdf: $createAccountPdf,
    sendCrowdPayEmailToGS: $sendCrowdPayEmailToGS,
  )
}`;
export const adminProcessCip = gql`
mutation adminProcessCip($userId: String!, $accountId: String!) {
  adminProcessCip(
    userId: $userId,
    accountId: $accountId,
  )
}`;
export const adminProcessInvestorAccount = gql`
mutation adminProcessInvestorAccount($userId: String!, $accountId: String!) {
  adminProcessInvestorAccount(
    userId: $userId,
    accountId: $accountId,
  )
}`;
export const encryptOrDecryptUtility = gql`
query _encryptOrDecryptValue($userId: String!, $text: String!, $type: EncryptDecryptEnum!){
  encryptOrDecryptValue(
   userId: $userId
   text: $text
   type: $type
 )
}`;
