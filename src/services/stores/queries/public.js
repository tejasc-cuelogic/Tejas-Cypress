import gql from 'graphql-tag';

export const getJobListing = gql`
query _getJobListing{
    getJobListing
    {
    POSITION
    CITY
    STATE
    BOX_FILE_ID
    STATUS
    }
    }
`;
