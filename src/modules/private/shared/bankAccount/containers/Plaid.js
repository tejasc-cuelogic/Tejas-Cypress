import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Header, Button, Image, Grid, Form, Loader, Input, Dimmer, Message } from 'semantic-ui-react';
import { bankAccountActions } from '../../../../../services/actions';
import ManualForm from './ManualForm';
import { IND_BANK_LIST } from '../../../../../constants/account';
import { ListErrors } from '../../../../../theme/shared';
import AddFunds from './AddFunds';
import NSImage from '../../../../shared/NSImage';

@inject('bankAccountStore', 'uiStore', 'transactionStore')
@withRouter
@observer
export default class Plaid extends Component {
  componentWillMount() {
    this.props.bankAccountStore.setPlaidBankVerificationStatus(false);
    this.props.uiStore.clearErrors();
  }
  handleBankSelect = (referenceLink) => {
    // const returnResult = bankAccountActions.bankSelect(institutionID, action);
    this.props.transactionStore.requestOtpForManageTransactions().then(() => {
      const confirmUrl = `${referenceLink}/confirm`;
      this.props.history.push(confirmUrl);
    });
  }
  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
      showAddFunds,
      isPlaidBankVerified,
    } = this.props.bankAccountStore;
    const { inProgress, errors } = this.props.uiStore;
    const { action, refLink } = this.props;
    const headerText = action && action === 'change' ? 'Link bank account' : 'Link bank account';
    const subHeaderText = action && action === 'change' ?
      'Select your bank from the list'
      :
      `In order to make your first investment, you will need to link your bank and 
      add funds into your account. Please choose the bank below.`;
    if (isPlaidBankVerified) {
      this.handleBankSelect(refLink);
      this.props.bankAccountStore.setPlaidBankVerificationStatus(false);
    }

    if (showAddFunds) {
      return <AddFunds />;
    }
    if (bankLinkInterface === 'form') {
      return <ManualForm action={action} refLink={refLink} />;
    }
    return (
      <div className="center-align">
        <Header as="h3">{headerText}</Header>
        <p className="mb-30">{subHeaderText}</p>
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
                        {bankData.logo === null && <NSImage centered size="mini" path="banks/default.png" />}
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
                      onClick={
                        () => bankAccountActions.bankSelect(bankData.institutionID, action)
                      }
                    >
                      {/* eslint-disable import/no-dynamic-require */}
                      {/* eslint-disable global-require */}
                      <NSImage centered path={`banks/${bankData.institutionID}.png`} />
                    </Link>
                  </Grid.Column>
                ))
              }
            </Grid>
          }
        </div>
        {errors &&
          <Message error>
            <ListErrors errors={[errors.message]} />
          </Message>
        }
        <Button color="green" className="link-button" content="Or enter it manually" onClick={() => this.props.bankAccountStore.setBankLinkInterface('form')} />
      </div>
    );
  }
}
