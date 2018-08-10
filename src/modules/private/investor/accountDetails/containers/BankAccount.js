import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { Header, Grid, Card, Divider, Button } from 'semantic-ui-react';
import isEmpty from 'lodash/isEmpty';
import AccountDetailsView from '../components/bankaccount/AccountDetailsView';
import { FaqWidget } from '../../../../../theme/shared';
import LinkBankAccount from './LinkBankAccount';

const data = {
  accountDetails: { number: '..3456', dateLinked: '3/20/18', status: 'Active' },
};

@inject('bankAccountStore', 'educationStore')
export default class BankAccount extends Component {
  handleLinkBankInterface = () => {
    this.props.bankAccountStore.setBankLinkInterface('list');
  }

  render() {
    const { faqsOfModule } = this.props.educationStore;
    return (
      <div>
        <Switch>
          <Route exact path={`${this.props.match.url}/link-bank-account`} component={LinkBankAccount} />
        </Switch>
        <Header as="h4">Bank Account</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris
          nec malesuada fames ac turpis
        </p>
        <Grid>
          {isEmpty(this.props.bankAccountStore.plaidAccDetails) &&
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
          {!isEmpty(this.props.bankAccountStore.plaidAccDetails) &&
            <AccountDetailsView accountDetails={data.accountDetails} />
          }
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={10} computer={10} tablet={13} mobile={16}>
              <FaqWidget heading="Bank Account" faqs={faqsOfModule} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
