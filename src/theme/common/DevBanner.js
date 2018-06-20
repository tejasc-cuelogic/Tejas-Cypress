import React from 'react';
import { Button } from 'semantic-ui-react';
import moment from 'moment';
import { REACT_APP_DEPLOY_ENV, REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH } from '../../constants/common';

const DevBanner = props => (
  <div
    style={{
      fontSize: '14px',
      color: 'white',
      textAlign: 'center',
      background: '#EB5757',
      padding: '5px',
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0',
    }}
  >
    <b>Environment:</b> {REACT_APP_DEPLOY_ENV} |{' '}
    <b>Last updated:</b>
    {moment(REACT_APP_DEPLOY_TIME).local().format('D/MM/YY h:m a')} |{' '}
    <b>Deploy Branch:</b> {REACT_APP_DEPLOY_BRANCH}
    <Button inverted onClick={props.toggle} style={{ marginLeft: '10px', padding: '5px 12px' }}>
      Hide
    </Button>
  </div>
);

export default DevBanner;
