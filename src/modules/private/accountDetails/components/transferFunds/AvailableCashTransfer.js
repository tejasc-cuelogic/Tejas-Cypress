import React from 'react';
import Aux from 'react-aux';
import { Route, Link } from 'react-router-dom';
import { Grid, Card, Button, Statistic, Popup, Icon } from 'semantic-ui-react';
import Helper from '../../../../../helper/utility';
import AddWithdrawFund from './AddWithdrawFund';

const AvailableCashTransfer = props => (
  <Aux>
    <Card fluid>
      <Card.Content>
        <Grid columns="equal">
          <Grid.Row>
            <Grid.Column>
              <Statistic size="tiny">
                <Statistic.Label>
                  Available cash
                  <Popup
                    trigger={<Icon className="ns-help-circle" />}
                    content="Available cash in your Nextseed Account"
                    position="top center"
                    className="center-align"
                  />
                </Statistic.Label>
                <Statistic.Value>{Helper.CurrencyFormat(props.cash)}</Statistic.Value>
              </Statistic>
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="middle">
              <Button as={Link} to={`${props.match.url}/add`} primary content="Add funds" />
              <Button as={Link} to={`${props.match.url}/withdraw`} inverted color="green" content="Withdraw funds" />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
    </Card>
    <Route exact path={`${props.match.url}/:action`} component={AddWithdrawFund} />
  </Aux>
);

export default AvailableCashTransfer;
