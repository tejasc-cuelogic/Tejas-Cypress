import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const TopBanner = props => (
  <div className={(props.leftMenu) ? 'sticky-message hide' : 'sticky-message'}>
    Small businesses affected by COVID-19 can{' '}<b><a href="https://www.nextseed.com/insights/community-bridge-notes">apply to raise working capital</a></b>
    {' '}and view helpful resources{' '}<b><a href="https://www.nextseed.com/insights/businesses-affected-by-coronavirus">here</a></b><br />
    Support local restaurants and healthcare workers with a{' '}
    <b><a target="_blank" rel="noopener noreferrer" href="https://charity.gofundme.com/o/en/campaign/life-fund">donation to the LIFE Fund</a></b>
    <Button
      icon
      onClick={props.toggle}
      className="close-button"
      circular
    >
      <Icon size="small" className="ns-close" />
    </Button>
  </div>
);

export default TopBanner;
