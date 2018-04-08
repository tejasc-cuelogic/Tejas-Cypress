import React from 'react';
import { observer } from 'mobx-react';
import PlaidLink from 'react-plaid-link';
import { Button } from 'semantic-ui-react';

@observer
export default class LinkBankAccountPlaid extends React.Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  render() {
    return (
      <div>
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
          <Button className="cancel-link" color="green" onClick={() => this.props.setDashboardWizardStep('LinkBankAccountForm')}>or enter bank details manually</Button>
        </div>
      </div>
    );
  }
}
