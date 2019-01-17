import gql from 'graphql-tag';

export const getBoxEmbedLink = gql`
  mutation _getBoxEmbedLink($fileId: String!) {
    getBoxEmbedLink (fileId: $fileId)
  }
`;

export const getLegalDocsFileIds = gql`
query _getlegalDocsFileIds{
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
  }
}
`;

