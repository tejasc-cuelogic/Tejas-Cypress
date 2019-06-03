import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Link, withRouter } from 'react-router-dom';
import { Grid, Card, Button, Statistic, Icon, Popup } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import AddWithdrawFund from './AddWithdrawFund';
import TransferFundVerifyModal from './previewModel/TransferFundVerifyModal';

// const AvailableCashTransfer = props => (
@withRouter
class AvailableCashTransfer extends Component {
  transferCtaInfo = () => ([
    {
      url: `${this.props.match.url}/withdraw`,
      content: 'Withdraw funds',
    },
    {
      url: `${this.props.match.url}/add`,
      content: 'Add funds',
    },
  ]);
  render() {
    const { props } = this;
    const cashMax = Math.max(Number(props.cash.replace(/[^0-9.-]+/g, '')), 0);
    let cashDisp = '$0.00';
    if (!Number.isNaN(cashMax)) {
      cashDisp = Helper.CurrencyFormat(cashMax);
    }

    return (
      <Aux>
        <Card fluid>
          <Card.Content>
            <Grid>
              <Grid.Column mobile={16} tablet={6} computer={6}>
                <Statistic size="tiny">
                  <Statistic.Label>Available cash
                    <Popup
                      trigger={<Icon className="ns-help-circle" />}
                      content="Available cash includes funds that are immediately available for withdrawal. This excludes pending incoming deposits, pending investments, and investment credits."
                      position="top center"
                      wide
                    />
                  </Statistic.Label>
                  <Statistic.Value>
                    {cashDisp}
                  </Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column mobile={16} tablet={10} computer={10} verticalAlign="middle" className="right-align">
                <Button.Group widths="2">
                  {
                  props.isAccountFrozen ?
                    <Aux>
                      {
                        this.transferCtaInfo().map(info => (
                          <Popup
                            hoverable
                            trigger={
                              <span className="mr-10">
                                <Button as={Link} to={info.url} className="disabled" inverted color="green" content={info.content} />
                              </span>
                            }
                            position="top center"
                            wide
                          >
                            <Popup.Content>
                              {`You cannot ${info.content} as your account is in frozen state.`}
                            </Popup.Content>
                          </Popup>
                        ))
                      }
                    </Aux> :
                    <Aux>
                      {
                        this.transferCtaInfo().map(info => (
                          <Button as={Link} to={info.url} inverted color="green" content={info.content} />
                        ))
                      }
                    </Aux>
                  }
                </Button.Group>
              </Grid.Column>
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
