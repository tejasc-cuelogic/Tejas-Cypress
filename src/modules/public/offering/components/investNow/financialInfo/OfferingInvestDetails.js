import React from 'react';
import Aux from 'react-aux';
// import { Link } from 'react-router-dom';
import { Header, Grid, Statistic, Icon } from 'semantic-ui-react';
// import Helper from '../../../../../../helper/utility';

const OfferingInvestDetails = () => (
  <Aux>
    <Header as="h3" textAlign="center">Update your investment amount</Header>
    <div className="featured-section investment-details">
      <Grid columns={2} divided relaxed="very">
        <Grid.Row>
          <Grid.Column>
            <Statistic size="mini" className="basic">
              <Statistic.Label>Current investment amount</Statistic.Label>
              <Statistic.Value>$12,300</Statistic.Value>
            </Statistic>
          </Grid.Column>
          <Grid.Column>
            <Statistic size="mini" className="basic">
              <Statistic.Label>Account</Statistic.Label>
              <Statistic.Value>
                <Icon className="ns-individual-line" color="green" /> MUMU Hot Pot
              </Statistic.Value>
            </Statistic>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  </Aux>
);

export default OfferingInvestDetails;
