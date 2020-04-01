import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = props => (
  <Dimmer active page={props.page} className={props.className}>
    <Loader>{props.loaderMessage}</Loader>
  </Dimmer>
);

export default Spinner;
