import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import PlaidLink from 'react-plaid-link';
import { Header, Button, Item, Input } from 'semantic-ui-react';
import Banklogo from '../../../../assets/images/boa-logo.jpg';

@inject('individualAccountStore')
@observer
export default class LinkBankPlaid extends Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  render() {
    const { formBankSearch, bankSearchChange } = this.props.individualAccountStore;
    console.log(formBankSearch);
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Select your bank from the list</Header>
        <div className="row">
          <Input
            fluid
            name={formBankSearch.fields.bankName.key}
            value={formBankSearch.fields.bankName.value}
            placeholder="Search"
            onChange={bankSearchChange}
          />
          <div className="six columns">
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
            <Item.Image size="small" src={Banklogo} />
          </div>
        </div>
        <div className="center-align">
          <Button className="theme-link" primary onClick={() => this.props.accountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
