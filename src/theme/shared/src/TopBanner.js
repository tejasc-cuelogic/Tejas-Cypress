import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const TopBanner = props => (
  <div
    style={{
      fontSize: '16px',
      minHeight: '38px',
      color: '#FFF',
      textAlign: 'center',
      background: '#676767',
      padding: '5px 20px',
      position: 'fixed',
      bottom: '0px',
      left: '0',
      right: '0',
      zIndex: '110',
    }}
  >
    {/* <span style={{ float: 'left' }}>
      Come Together
    </span> */}
    <strong><a href="https://www.nextseed.com/insights/businesses-affected-by-coronavirus">Click here</a></strong> to view resources for small businesses during the Coronavirus crisis.
    <Button
      icon
      circular
      onClick={props.toggle}
      style={{
        padding: '0 5px',
        position: 'absolute',
        color: '#FFF',
        background: '#676767',
        right: '10px',
        top: '10px',
        height: '18px',
        minHeight: 'auto',
        lineHeight: '.75',
      }}
    >
      <Icon size="small" className="ns-close" />
    </Button>
  </div>
);

export default TopBanner;
