import React from 'react';
import NavigationItems from './NavigationItems';

const header = props => (
  <div>
    <NavigationItems {...props} />
  </div>
);

export default header;
