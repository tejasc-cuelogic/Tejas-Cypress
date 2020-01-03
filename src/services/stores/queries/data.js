import gql from 'graphql-tag';

export const adminGenerateInvestorFolderStructure = gql`
mutation adminGenerateInvestorFolderStructure($userId: String!){
    adminGenerateInvestorFolderStructure(userId: $userId)  
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

export const adminProcessFullInvestorAccount = gql`
mutation adminProcessFullInvestorAccount($userId: String!, $accountId: String!, $createRSAccount: Boolean!, $createInitialDeposit: Boolean!, $sendEmailToInvestor: Boolean!, $createGsContactAccount: Boolean!, $createAccountPdf: Boolean!, $sendCrowdPayEmailToGS: Boolean!, $skipFullAccountValidation: Boolean!) {
  adminProcessFullInvestorAccount(
    userId: $userId,
    accountId: $accountId,
    createRSAccount: $createRSAccount, 
    createInitialDeposit: $createInitialDeposit,
    sendEmailToInvestor: $sendEmailToInvestor,
    createGsContactAccount: $createGsContactAccount,
    createAccountPdf: $createAccountPdf,
    sendCrowdPayEmailToGS: $sendCrowdPayEmailToGS,
    skipFullAccountValidation: $skipFullAccountValidation,
  )
}`;
export const adminCrowdPayProcessCip = gql`
mutation adminCrowdPayProcessCip($userId: String!, $accountId: String!) {
  adminCrowdPayProcessCip(
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
export const adminProcessTransferRequest = gql`
mutation adminProcessTransferRequest($transferId: Int!) {
  adminProcessTransferRequest(
    transferId: $transferId,
  )
}`;
export const adminEncryptOrDecryptValue = gql`
query adminEncryptOrDecryptValue($userId: String!, $text: String!, $type: EncryptDecryptEnum!){
  adminEncryptOrDecryptValue(
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

export const adminSyncEsDocument = gql`
mutation adminSyncEsDocument($documentId: String!, $targetIndex: String!, $userId: String!, $accountType: [InvestorAccountTypeEnum]){
  adminSyncEsDocument(documentId: $documentId, targetIndex: $targetIndex, userId: $userId, accountType: $accountType)
}`;

export const getPluginList = gql`
query listRequestPlugins {
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
    plugins{   
      name   
      plugin   
      pluginInputs{   
       label
       type
       key
       value
       rule
       defaultValue
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
        options{
          key
          value
          text
        }
      }
    }
  }
}
`;

export const listFilePlugins = gql`
query listFilePlugins {
  listFilePlugins {
    name
    plugin
    pluginInputs {
      label
      type
      key
      value
      rule
      defaultValue
    }
  }
} 
`;

export const requestFactoryPluginTrigger = gql`
mutation invokeRequest($plugin: String!, $payload: String, $invocationType: RequestInvocationEnum) {
  invokeRequest(
    plugin: $plugin,
    payload: $payload
    invocationType: $invocationType
  )
}`;

export const fetchCronLogs = gql`
query fetchCronLogs($cron: String!, $jobId: String, $cronMetaType: cronMetaTypeEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
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
mutation invokeProcessorDriver($method: DevAuditTypeEnum, $payload: String) {
  invokeProcessorDriver(
    method: $method,
    payload: $payload
  )
}`;

export const fetchRequestFactoryLogs = gql`
query fetchRequestFactoryLogs($plugin: String!, $status: RequestRunLogStatusEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  fetchRequestFactoryLogs(
    plugin: $plugin,
    status: $status
    fromDate: $fromDate
    toDate: $toDate
    lek: $lek
    limit: $limit
  )
  {
    requestLogs{
      status
      invocationType
      triggeredDate
      payload{
        params
      }
      created{
        id
        by
        date
      }
      updated{
        id
        by
        date
      }
    }
    resultCount
    totalCount
    lek
  }
}`;

export const fetchProcessLogs = gql`
query fetchProcessLogs($plugin: String!, $status: ProcessRunLogStatusEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  fetchProcessLogs(
    plugin: $plugin,
    status: $status
    fromDate: $fromDate
    toDate: $toDate
    lek: $lek
    limit: $limit
  )
  {
    processLogs{
      jobId
      triggeredDate
      status
      payload
      completePayload
    }
    resultCount
    totalCount
    lek
  }
}`;

export const fileFactoryPluginTrigger = gql`
mutation generateFile($identifier: String!, $ownerId: String!, $resourceId: String!, $account: String, $payload: String) {
  generateFile(
    identifier: $identifier,
    ownerId: $ownerId,
    resourceId: $resourceId,
    account: $account,
    payload: $payload
  )
}`;
