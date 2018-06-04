import React from 'react';
import { NavigationItems } from './NavigationItems';

const header = props => (
  <div className="header-wrap">
    <NavigationItems {...props} />
    {props.showSecondaryHeader &&
      <div className="ui container fluid secondaryHeader">
        <div className="ui one column grid">
          <h2>Account Summary</h2>
        </div>
      </div>
    }
  </div>
);

export default header;
