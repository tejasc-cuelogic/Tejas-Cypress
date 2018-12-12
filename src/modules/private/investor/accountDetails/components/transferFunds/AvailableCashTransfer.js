import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link, withRouter } from 'react-router-dom';
import { Grid, Card, Button, Statistic } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import AddWithdrawFund from './AddWithdrawFund';
import TransferFundVerifyModal from './previewModel/TransferFundVerifyModal';

// const AvailableCashTransfer = props => (
@withRouter
class AvailableCashTransfer extends Component {
  render() {
    const { props } = this;
    return (
      <Aux>
        <Card fluid>
          <Card.Content>
            <Grid columns="equal">
              <Grid.Row>
                <Grid.Column>
                  <Statistic size="tiny">
                    <Statistic.Label>Available cash</Statistic.Label>
                    <Statistic.Value>{Helper.CurrencyFormat(props.cash)}</Statistic.Value>
                  </Statistic>
                </Grid.Column>
                <Grid.Column textAlign="right" verticalAlign="middle">
                  <Button as={Link} to={`${props.match.url}/withdraw`} inverted color="green" content="Withdraw funds" />
                  <Button as={Link} to={`${props.match.url}/add`} primary content="Add funds" />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Content>
        </Card>
        <Route
          exact
          path={`${props.match.url}/:action`}
          render={params => <AddWithdrawFund refLink={props.match.url} {...params} {...props} />}
        />
        <Route
          exact
          path={`${this.props.match.url}/:action/verify`}
          render={() => (<TransferFundVerifyModal
            refLink={this.props.refLink}
            refLinkList={this.props.match.url}
          />)
          }
        />
      </Aux>
    );
  }
}

export default AvailableCashTransfer;
