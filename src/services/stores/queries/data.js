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
export const processTransferRequest = gql`
mutation processTransferRequest($transferId: Int!) {
  processTransferRequest(
    transferId: $transferId,
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
export const auditBoxFolder = gql`
mutation _auditBox($role:UserRoleEnum!, $userId: String, $jobId: String, $waitingTime: Int, $concurrency: Int,$queueLimit: Int) {
  auditBox(
    role: $role,
    userId: $userId
    jobId: $jobId
    waitingTime: $waitingTime
    concurrency: $concurrency
    queueLimit: $queueLimit
  ){
    activityType
    subType
    activityTitle
    activity
  }
}`;

export const getListOfPartialOrCIPProcessingAccount = gql`
query getListOfPartialOrCIPProcessingAccount {
  getListOfPartialOrCIPProcessingAccount {
    userId
    accountId
    accountType
    accountStatus
    cip {
      requestId
      expiration
      failType
      failReason {
        key
        message
      }
    }
    legalStatus
    totalBalance
    numberOfValidAgreements
    userStatus
    accountCreatedDate
  }
}`;

export const syncEsDocument = gql`
mutation syncEsDocument($documentId: String!, $targetIndex: String!, $userId: String, $accountType: InvestorAccountTypeEnum){
  syncEsDocument(documentId: $documentId, targetIndex: $targetIndex, userId: $userId, accountType: $accountType)
}`;
