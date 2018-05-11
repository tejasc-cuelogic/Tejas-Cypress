import React from 'react';
import Aux from 'react-aux';
import { Header, Grid } from 'semantic-ui-react';

const PortfolioAllocations = () => (
  <Aux>
    <Header as="h3">Portfolio Allocations</Header>
    <Grid columns="equal" celled="internally">
      <Grid.Column>
        graph !
      </Grid.Column>
      <Grid.Column>
        graph !
      </Grid.Column>
      <Grid.Column>
        graph !
      </Grid.Column>
    </Grid>
  </Aux>
);

export default PortfolioAllocations;
