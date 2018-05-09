import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
// import PlaidLink from 'react-plaid-link';
import { Header, Button, Item, List } from 'semantic-ui-react';
import accountActions from '../../../../actions/account';
// import {
//   PLAID_PUBLIC_KEY,
// } from '../../../../constants/account';
import LinkBankForm from './LinkBankForm';
import { FormInput } from '../../../../components/form/FormElements';
// import Banklogo from '../../../../assets/images/boa-logo.jpg';

@inject('individualAccountStore')
@observer
export default class LinkBankPlaid extends Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  render() {
    const {
      bankLinkInterface,
      formBankSearch,
      bankSearchChange,
      bankListing,
    } = this.props.individualAccountStore;
    if (bankLinkInterface === 'form') {
      return <LinkBankForm />;
    }
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Select your bank from the list</Header>
        <div className="row">
          <FormInput
            name="bankName"
            fielddata={formBankSearch.fields.bankName}
            changed={bankSearchChange}
            onBlur={accountActions.bankSearch}
          />
          {/* <PlaidLink
            clientName="NS"
            env="sandbox"
            product={['auth', 'transactions']}
            publicKey={PLAID_PUBLIC_KEY}
            // publicKey="ca61661fcb15b5e735eabae68771b6"
            onExit={this.handleOnExit}
            onSuccess={this.handleOnSuccess}
          >
            Open Link and connect your bank!
          </PlaidLink> */}
          <div className="">
            {
              <List celled vertical inverted>
                {
                  _.map(bankListing, bankData => (
                    <Link
                      key={bankData.institution_id}
                      as="a"
                      to="/app/dashboard"
                      onClick={() => accountActions.bankSelect(bankData.institution_id)}
                    >
                      {bankData.logo !== null && <Item.Image size="mini" src={`data:image/png;base64, ${bankData.logo}`} />}
                      <span>{bankData.name}</span>
                    </Link>
                  ))
                }
              </List>
            }
          </div>
        </div>
        <div className="center-align">
          <Button className="theme-link" primary onClick={() => this.props.individualAccountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
