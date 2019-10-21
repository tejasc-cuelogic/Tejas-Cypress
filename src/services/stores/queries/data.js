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
mutation syncEsDocument($documentId: String!, $targetIndex: String!, $userId: String, $accountType: [InvestorAccountTypeEnum]){
  syncEsDocument(documentId: $documentId, targetIndex: $targetIndex, userId: $userId, accountType: $accountType)
}`;

export const getPluginList = gql`
query _listRequestPlugins {
  listRequestPlugins {
    plugins{
      name
      plugin
      pluginInputs{
        label
        type
        value
        key
        rule
        defaultValue
      }
    }
  }
  listCronPlugins
  {
    plugins {
      name
      pluginInputs {
        name
      }
    }
  }
  listProcessorPlugins
  {
    plugins{
      name
      plugin
      pluginInputs{
        label
        type
        value
        key
        rule
        defaultValue
      }
    }
  }
}
`;

export const requestFactoryPluginTrigger = gql`
mutation invokeRequest($method: RequestWorkerPluginsEnum!, $payload: String, $invocationType: RequestInvocationEnum) {
  invokeRequest(
    method: $method,
    payload: $payload
    invocationType: $invocationType
  )
}`;

export const fetchCronLogs = gql`
query _fetchCronLogs($cron: String!, $jobId: String, $cronMetaType: cronMetaTypeEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  fetchCronLogs(
    cron: $cron,
    jobId: $jobId
    cronMetaType: $cronMetaType
    fromDate: $fromDate
    toDate: $toDate
    lek: $lek
    limit: $limit
  )
  {
    cronLog{
      jobId
      execStatus
      cron
      execInitiatedOn
      cronMetaType
    }
    resultCount
    totalCount
    lek
  }
}`;

export const processFactoryPluginTrigger = gql`
mutation _invokeProcessorDriver($method: DevAuditTypeEnum, $payload: String) {
  invokeProcessorDriver(
    method: $method,
    payload: $payload
  )
}`;
