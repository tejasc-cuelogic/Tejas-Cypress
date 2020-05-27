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

export const adminRunRdsQuery = gql`
query adminRunRdsQuery($table: String!, $selectColumns: [String], $where: [RdsWhereColumnInput], $groupByColumns: [String], $orderBy: [RdsOrderByInput], $page: Int, $pageSize: Int) {
  adminRunRdsQuery(table: $table, selectColumns: $selectColumns, where: $where, groupByColumns: $groupByColumns, orderBy: $orderBy, page: $page, pageSize: $pageSize) {
    page
    totalCount
    resultCount
    results
  }
}
`;


export const adminListRdsPlugins = gql`
query adminListRdsPlugins {
  adminListRdsPlugins {
    tables {
      key value
      columns { key value type }
    }
    operators
    orderTypes { key value }
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
mutation adminSyncEsDocument($documentId: String!, $targetIndex: String!, $userId: String, $accountType: [InvestorAccountTypeEnum]){
  adminSyncEsDocument(documentId: $documentId, targetIndex: $targetIndex, userId: $userId, accountType: $accountType)
}`;

export const adminExportEsIndexRecords = gql`
mutation adminExportEsIndexRecords($targetIndex: String!) {
  adminExportEsIndexRecords(targetIndex: $targetIndex)
}`;

export const getPluginList = gql`
query adminListRequestPlugins {
  adminListRequestPlugins {
    plugins{
      note
      description
      name
      plugin
      pluginInputs{
        label
        type
        value
        key
        rule
        defaultValue
        defaultValuesMapping
        defaultValues{
          key
          value
        }
        options{
          key
          value
          text
        }
      }
    }
  }
  adminListCronPlugins
  {
    plugins{
      note
      description   
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
  adminListProcessorPlugins
  {
    plugins{
      note
      description
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
          note
          description
        }
      }
    }
  }
}
`;

export const adminListFilePlugins = gql`
query adminListFilePlugins {
  adminListFilePlugins {
    name
    note
    description
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

export const adminInvokeRequest = gql`
mutation adminInvokeRequest($plugin: String!, $payload: String, $invocationType: RequestInvocationEnum) {
  adminInvokeRequest(
    plugin: $plugin,
    payload: $payload
    invocationType: $invocationType
  )
}`;

export const adminFetchCronLogs = gql`
query adminFetchCronLogs($cron: String!, $jobId: String, $cronMetaType: cronMetaTypeEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  adminFetchCronLogs(
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

export const adminInvokeProcessorDriver = gql`
mutation adminInvokeProcessorDriver($method: DevAuditTypeEnum, $payload: String) {
  adminInvokeProcessorDriver(
    method: $method,
    payload: $payload
  )
}`;

export const adminFetchRequestFactoryLogs = gql`
query adminFetchRequestFactoryLogs($plugin: String!, $status: RequestRunLogStatusEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  adminFetchRequestFactoryLogs(
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

export const adminFetchProcessLogs = gql`
query adminFetchProcessLogs($plugin: String!, $status: ProcessRunLogStatusEnum, $fromDate: String, $toDate: String, $lek: String, $limit: Int) {
  adminFetchProcessLogs(
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

export const adminGenerateFile = gql`
mutation adminGenerateFile($identifier: String!, $ownerId: String!, $resourceId: String!, $account: String, $payload: String) {
  adminGenerateFile(
    identifier: $identifier,
    ownerId: $ownerId,
    resourceId: $resourceId,
    account: $account,
    payload: $payload
  )
}`;
