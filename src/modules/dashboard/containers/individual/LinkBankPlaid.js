import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import PlaidLink from 'react-plaid-link';
import { Header, Button } from 'semantic-ui-react';

@inject('accountStore')
@observer
export default class LinkBankPlaid extends Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  render() {
    return (
      <div>
        <Header as="h1" textAlign="center">Link Bank Account</Header>
        <Header as="h4" textAlign="center">Select your bank from the list</Header>
        <div className="row">
          <div className="six columns">
            <PlaidLink
              clientName="Plaid Client"
              env="sandbox"
              product={['auth']}
              publicKey="614be98f819e9bd8d0db9abec1c08a"
              apiVersion="v2"
              onSuccess={this.handleOnSuccess}
            >
              Open Plaid Link button
            </PlaidLink>
          </div>
        </div>
        <div className="center-align">
          <Button className="theme-link" primary onClick={() => this.props.accountStore.setBankLinkInterface('form')}>or enter it manually</Button>
        </div>
      </div>
    );
  }
}
