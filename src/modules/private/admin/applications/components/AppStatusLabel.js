import React from 'react';
import { Label } from 'semantic-ui-react';
import { find } from 'lodash';
import { BUSINESS_APP_ADMIN_STATUS } from '../../../../../services/constants/businessApplication';

export const AppStatusLabel = (props) => {
  let appStatusLabel = { color: null, title: null };
  appStatusLabel = find(BUSINESS_APP_ADMIN_STATUS, status => status.status === props.status);
  appStatusLabel = { color: 'red', title: 'test' };
  return (
    appStatusLabel.title && appStatusLabel.color && <Label color={appStatusLabel.color} size="small" horizontal>{appStatusLabel.title}</Label>
  );
};
