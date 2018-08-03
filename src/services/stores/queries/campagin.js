import gql from 'graphql-tag';

export const allCampaigns = gql`
  query allCampaigns {
    allCampaigns{
      id
      createdAt
      title
      address
      description
      flagged
      label
      image
    }
  }
`;

export const campaignDetailsQuery = gql`
  query campaignDetailsQuery($id: ID!) {
    Campaign(id: $id) {
      id
      createdAt
      title
      address
      description
      collected
      needed
      flagged
      label
      industry
      investmentType
    }
  }
`;
