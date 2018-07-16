import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = props => (
  <Dimmer active>
    <Loader>{props.loaderMessage}</Loader>
  </Dimmer>
);

export default Spinner;
