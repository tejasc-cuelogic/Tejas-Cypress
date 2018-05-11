import React, { Component } from 'react';
import { Header, Grid, Card, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AccountDetailsView from '../components/bankaccount/AccountDetailsView';
import Faqs from '../components/bankaccount/Faqs';

export default class BankAccount extends Component {
  render() {
    return (
      <div>
        <Header as="h3">Bank Account</Header>
        <p className="intro-text">Pellentesque facilisis. Nulla imperdiet sit amet magna. Vestibulum dapibus, mauris<br />
          nec malesuada fames ac turpis
        </p>
        <Grid>
          <Grid.Row>
            <Grid.Column widescreen={6} largeScreen={10} computer={10} tablet={13} mobile={16}>
              <Card fluid>
                <Card.Content>
                  <Header as="h3">You haven’t linked bank account yet</Header>
                  <p>Link your bank account to be able to invest in offerings.</p>
                  <Divider hidden />
                  <Card.Description>
                    {/* <Button primary content="Link bank account" /> */}
                    <Link as="button" to={`${this.props.match.url}/link-bank-account`}>Link Bank Account</Link>
                  </Card.Description>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <AccountDetailsView />
          <Faqs />
        </Grid>
      </div>
    );
  }
}
