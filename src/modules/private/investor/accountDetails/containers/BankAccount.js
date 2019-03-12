import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Header, Grid, Card, Divider, Button } from 'semantic-ui-react';
import { isEmpty, includes, get } from 'lodash';
import Aux from 'react-aux';
import AccountDetailsView from '../components/bankaccount/AccountDetailsView';
import ConfirmBankLinking from '../components/bankaccount/ConfirmBankLinking';
import VerifyBankUpdate from '../components/bankaccount/VerifyBankUpdate';
import LinkBankAccount from './LinkBankAccount';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';

@inject('bankAccountStore', 'educationStore', 'userDetailsStore')
export default class BankAccount extends Component {
  componentWillMount() {
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    this.props.bankAccountStore.setCurrentAccount(accountType);
  }
  handleLinkBankInterface = () => {
    this.props.bankAccountStore.setBankLinkInterface('list');
  }

  render() {
    const { plaidAccDetails } = this.props.bankAccountStore;
    const { userDetails } = this.props.userDetailsStore;
    const pendingAccoungDetails = plaidAccDetails && plaidAccDetails.changeRequest &&
      plaidAccDetails.changeRequest.status !== 'REQUEST_CANCELLATION' ? plaidAccDetails.changeRequest : null;
    let isCheckedIra = false;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    get(userDetails, 'roles').map((role) => {
      if (get(role, 'details.fundingType') === 'check' && accountType === 'ira') {
        isCheckedIra = true;
      }
      return null;
    });
    return (
      <div>
        <Switch>
          <Route
            exact
            path={`${this.props.match.url}/link-bank-account`}
            component={LinkBankAccount}
            render={props =>
              <LinkBankAccount refLink={this.props.match.url} {...props} />}
          />
        </Switch>
        <Route
          path={`${this.props.match.url}/link-bank-account/confirm`}
          render={props =>
            <ConfirmBankLinking refLink={this.props.match.url} {...props} />}
        />
        <Route
          path={`${this.props.match.url}/link-bank-account/verify-update`}
          render={props =>
            <VerifyBankUpdate refLink={this.props.match.url} {...props} />}
        />
        <Route
          path={`${this.props.match.url}/cancel-bank-account/confirm`}
          render={props =>
            <ConfirmBankLinking refLink={this.props.match.url} {...props} />}
        />
        { (accountType === 'ira' && isCheckedIra) || (accountType !== 'ira') ?
          <Aux>
            <Header as="h4">Bank Account</Header>
            <Grid>
              {isEmpty(plaidAccDetails) &&
                <Grid.Row>
                  <Grid.Column widescreen={6} largeScreen={8} computer={10} tablet={13} mobile={16}>
                    <Card fluid>
                      <Card.Content>
                        <Header as="h4">You haven’t linked bank account yet</Header>
                        <p>Link your bank account to be able to invest in offerings.</p>
                        <Divider hidden />
                        <Card.Description>
                          <Button as={Link} onClick={() => this.handleLinkBankInterface()} to={`${this.props.match.url}/link-bank-account`} primary content="Link bank account" />
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              }
              {!isEmpty(plaidAccDetails) &&
                <Grid.Row>
                  <Grid.Column
                    widescreen={12}
                    largeScreen={16}
                    computer={16}
                    tablet={16}
                    mobile={16}
                  >
                    <Card fluid className="linked-bank">
                      <AccountDetailsView
                        accountDetails={plaidAccDetails}
                        click={this.handleLinkBankInterface}
                        match={this.props.match}
                        accountType="active"
                        pendingAccoungDetails={pendingAccoungDetails}
                      />
                      {!isEmpty(pendingAccoungDetails) &&
                        <AccountDetailsView
                          accountDetails={pendingAccoungDetails}
                          click={this.handleLinkBankInterface}
                          match={this.props.match}
                          accountType="pending"
                        />
                      }
                    </Card>
                  </Grid.Column>
                </Grid.Row>
              }
            </Grid>
          </Aux> :
          <section className="center-align">
            <h4 style={{ color: '#31333d7d' }}><HtmlEditor readOnly content="Linked Bank accounts are not available for an IRA Account with funding by Check" /></h4>
          </section>
        }
      </div>
    );
  }
}
