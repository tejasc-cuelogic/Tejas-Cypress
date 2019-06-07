import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import moment from 'moment';
import { REACT_APP_DEPLOY_ENV, REACT_APP_DEPLOY_TIME, REACT_APP_DEPLOY_BRANCH } from '../../../constants/common';

const DevBanner = props => (
  <div
    style={{
      fontSize: '14px',
      minHeight: '34px',
      color: 'black',
      textAlign: 'center',
      background: '#FFE626',
      padding: '5px 30px',
      position: 'fixed',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: '100',
    }}
  >
    <span style={{ float: 'left' }}>
      <b>Environment:</b> {REACT_APP_DEPLOY_ENV}
    </span>
    <b>Deploy Branch:</b> {REACT_APP_DEPLOY_BRANCH}
    <span style={{ float: 'right' }}>
      <b>Last updated:</b> {moment(new Date(REACT_APP_DEPLOY_TIME)).local().format('MM/DD/YY h:m a')}
    </span>
    <Button
      icon
      circular
      size="mini"
      color="black"
      onClick={props.toggle}
      style={{
        padding: '0 5px',
        position: 'absolute',
        right: '0',
        top: '-10px',
        height: '18px',
        minHeight: 'auto',
        lineHeight: '.75',
      }}
    >
      <Icon size="small" className="ns-close" />
    </Button>
  </div>
);

export default DevBanner;
