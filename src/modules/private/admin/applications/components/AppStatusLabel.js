import React from 'react';
import { Label } from 'semantic-ui-react';
import { find } from 'lodash';
import { BUSINESS_APP_ADMIN_STATUS, BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

export const AppStatusLabel = (props) => {
  let appStatusLabel = null;
  const {
    applicationStatus, prequalStatus, stashed, deleted,
  } = props.application;
  const appStatus = (applicationStatus || prequalStatus);
  let cStatus = '';
  cStatus = appStatus === BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED ? 'NEW' : cStatus;
  cStatus = stashed ? 'STASH' : cStatus;
  cStatus = deleted ? 'DELETED' : cStatus;
  cStatus = appStatus === BUSINESS_APPLICATION_STATUS.APPLICATION_OFFERED ? 'OFFERED' : cStatus;
  cStatus = appStatus === BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL ? 'SIGNED' : cStatus;
  cStatus = appStatus === BUSINESS_APPLICATION_STATUS.REVIEW_FAILED ? 'NS_DECLINED' : cStatus;
  cStatus = appStatus === BUSINESS_APPLICATION_STATUS.ISSUER_DECLINED ? 'ISSUER_DECLINED' : cStatus;

  appStatusLabel = find(BUSINESS_APP_ADMIN_STATUS, status => status.status === cStatus);
  return (
    (appStatusLabel && appStatusLabel.title && appStatusLabel.color) ? <Label color={appStatusLabel.color} size="small" horizontal>{appStatusLabel.title}</Label> : ''
  );
};
