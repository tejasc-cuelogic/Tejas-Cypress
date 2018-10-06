import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Header } from 'semantic-ui-react';
import PerformanceChart from './PerformanceChart';

export default class PaymentPerformance extends Component {
  render() {
    return (
      <Aux>
        <Header as="h4">Payment Performance</Header>
        <Grid>
          <Grid.Row>
            <Grid.Column width={2}>
              left
            </Grid.Column>
            <Grid.Column width={14}>
              <PerformanceChart />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Aux>
    );
  }
}
