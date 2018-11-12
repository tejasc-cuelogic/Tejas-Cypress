import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Button, Image, Grid, Form, Loader, Input, Dimmer, Message } from 'semantic-ui-react';
import { bankAccountActions } from '../../../../../services/actions';
import ManualForm from './ManualForm';
import defaultBankLogo from '../../../../../assets/images/banks/default.png';
import { IND_BANK_LIST } from '../../../../../constants/account';
import { ListErrors } from '../../../../../theme/shared';
import AddFunds from './AddFunds';

@inject('bankAccountStore', 'uiStore')
@withRouter
@observer
export default class Plaid extends Component {
  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
      showAddFunds,
    } = this.props.bankAccountStore;
    const { inProgress, errors } = this.props.uiStore;

    if (showAddFunds) {
      return <AddFunds />;
    }
    if (bankLinkInterface === 'form') {
      return <ManualForm />;
    }
    return (
      <div>
        <Header as="h3" textAlign="center">What is your employment status?</Header>
        <p className="center-align mb-30">
          In order to make your first investment, you will need to link your bank and
          add funds into your account. Please choose the bank below.
        </p>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Form>
          <Input
            fluid
            placeholder="Search"
            name="bankName"
            icon={{ className: 'ns-search' }}
            iconPosition="left"
            value={formBankSearch.fields.bankName.value}
            onChange={bankSearchChange}
            onKeyPress={bankAccountActions.bankSearch}
          />
        </Form>
        <div className="bank-list">
          <Dimmer active={inProgress}>
            <Loader active={inProgress} />
          </Dimmer>
          {typeof bankListing !== 'undefined' && bankListing.length === 0 &&
            <Grid column={1} textAlign="center">
              <Grid.Column>No results found.</Grid.Column>
            </Grid>
          }
          {
            <Grid centered>
              {typeof bankListing !== 'undefined' &&
                bankListing.map(bankData => (
                  <Grid.Column key={bankData.institution_id} computer={5} tablet={5} mobile={8}>
                    <Link
                      as="a"
                      className="bank-link"
                      to={this.props.match.url}
                      onClick={() => bankAccountActions.bankSelect(bankData.institution_id)}
                    >
                      <span>
                        {bankData.logo !== null && <Image centered size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                        {bankData.logo === null && <Image centered size="mini" src={defaultBankLogo} />}
                        <span>{bankData.name}</span>
                      </span>
                    </Link>
                  </Grid.Column>
                ))
              }
              {typeof bankListing === 'undefined' &&
                IND_BANK_LIST.map(bankData => (
                  <Grid.Column key={bankData.institutionID} computer={5} tablet={5} mobile={8}>
                    <Link
                      as="a"
                      className="bank-link"
                      to={this.props.match.url}
                      onClick={() => bankAccountActions.bankSelect(bankData.institutionID)}
                    >
                      {/* eslint-disable import/no-dynamic-require */}
                      {/* eslint-disable global-require */}
                      <Image centered src={require(`../../../../../assets/images/banks/${bankData.institutionID}.png`)} />
                    </Link>
                  </Grid.Column>
                ))
              }
            </Grid>
          }
        </div>
        <div className="center-align">
          <Button color="green" className="link-button" onClick={() => this.props.bankAccountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
