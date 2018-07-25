import React from 'react';
import { Label } from 'semantic-ui-react';
import { BUSINESS_APP_STATUS2 } from '../../../../../services/constants/businessApplication';

export const AppStatusLabel = (props) => {
  let color = '';
  let title = '';
  switch (props.status) {
    case BUSINESS_APP_STATUS2.REMOVED:
      color = 'red';
      title = 'Removed';
      break;
    case BUSINESS_APP_STATUS2.DECLIENED:
      color = 'red';
      title = 'Decliened';
      break;
    case BUSINESS_APP_STATUS2.DELETED:
      color = 'red';
      title = 'Deleted';
      break;
    case BUSINESS_APP_STATUS2.NEW:
      color = 'gray';
      title = 'New';
      break;
    case BUSINESS_APP_STATUS2.ACCEPTED:
      color = 'green';
      title = 'Accepted';
      break;
    case BUSINESS_APP_STATUS2.OFFERED:
      color = 'green';
      title = 'Offered';
      break;
    case BUSINESS_APP_STATUS2.STASH:
      color = 'green';
      title = 'Stashed';
      break;
    default:
      break;
  }
  return (
    title && color && <Label color={color} size="small" horizontal>{title}</Label>
  );
};
