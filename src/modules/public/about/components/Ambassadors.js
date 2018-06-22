import React from 'react';
import Aux from 'react-aux';
import { Header, Divider } from 'semantic-ui-react';

const ambassadors = () => (
  <Aux>
    <Header as="h1">NextSeed Ambassadors
      <Header.Subheader>Champions of local growth</Header.Subheader>
    </Header>
    <Divider inverted section />
    <p className="pageContent">
      We’re working with some of the best and brightest thought leaders and
      influencers in local communities around the country. Together, we’re
      collaborating to drive and promote growth from Main Street on up.
    </p>
  </Aux>
);

export default ambassadors;
