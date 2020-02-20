import gql from 'graphql-tag';

export const getBoxEmbedLink = gql`
  mutation getBoxEmbedLink($fileId: String!, $accountType: BoxAccountTypeEnum) {
    getBoxEmbedLink (fileId: $fileId, accountType: $accountType)
  }
`;

export const getLegalDocsFileIds = gql`
query getlegalDocsFileIds{
  getLegalDocsFileIds
  {
    SECURITIES_PRIVACY_POLICY
    SECURITIES_BCP_DISCLOSURE
    SECURITIES_CIP_NOTICE
    SECURITIES_BROKER_CHECK
    SECURITIES_INVESTOR_AGREEMENT
    MEMBERSHIP_AGREEMENT
    CROWDPAY_CUSTODIAL_AGREEMENT
    BUSINESS_PLAN_101
    IRS_W9_CERTIFICATION
    INVESTOR_WELCOME_PACKET
    INSTRUCTIONS_1099_2017
    INSTRUCTIONS_1099_2018
    INSTRUCTIONS_1099_2019
  }
}
`;

export const getS3DownloadLinkByFileId = gql`
query getS3DownloadLinkByFileId($fileId: String!, $accountType: BoxAccountTypeEnum, $getS3DownloadLink: Boolean){
  getS3DownloadLinkByFileId(
    boxFileId: $fileId
    accountType: $accountType
    getS3DownloadLink: $getS3DownloadLink
  )
  {
    preSignedUrl
    boxFileId
  }
}`;
