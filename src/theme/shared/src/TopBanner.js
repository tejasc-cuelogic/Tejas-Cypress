import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

const TopBanner = props => (
  <div className={(props.leftMenu) ? 'sticky-message hide' : 'sticky-message'}>
    <b>
      <a target="_blank" rel="noopener noreferrer" href="https://charity.gofundme.com/o/en/campaign/life-fund">
        Click here
      </a>
    </b>
    {' '}to donate to the LIFE Fund.  Resources for small businesses impacted by the Coronavirus crisis can be{' '}
    <b><a href="https://www.nextseed.com/insights/businesses-affected-by-coronavirus">found here</a></b>.
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
