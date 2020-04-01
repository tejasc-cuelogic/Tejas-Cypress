import React from 'react';
import { NavigationItems } from './NavigationItems';

const header = props => (
  <div className={`${props.headerclass} header-wrap`}>
    <NavigationItems {...props} />
  </div>
);

export default header;
