import gql from 'graphql-tag';

export const updateUserMFA = gql`
  mutation updateUserMFA($mfaMode:  MFAModeEnum! ){
      updateUserMFA (mfaMode:$mfaMode)
  }
`;
