import gql from 'graphql-tag';

export const updateMfaModeType = gql`
  mutation _updateUserMFA($mfaMode:  MFAModeEnum! ){
      updateUserMFA (mfaMode:$mfaMode)
  }
`;
