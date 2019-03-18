import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Card, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes, capitalize } from 'lodash';
import Aux from 'react-aux';
@withRouter
@observer
@inject('userDetailsStore', 'uiStore')
export default class AccountSetup extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    this.props.uiStore.clearErrors();
  }

  renderAccType = () => {
    const { currentActiveAccount } = this.props.userDetailsStore;
    this.props.history.push(`/app/summary/account-creation/${currentActiveAccount}`);
  }
  render() {
    const { currentActiveAccount } = this.props.userDetailsStore;
    const msg = 'You\'re almost there! Continue setting up your NextSeed Investment Account to join the community and get access to local opportunities';
    return (
      <div className={includes(this.props.location.pathname, 'transactions') ? 'content-spacer' : ''}>
        {
          <Aux>
            <Header as="h4">{currentActiveAccount === 'ira' ? currentActiveAccount.toUpperCase() : capitalize(currentActiveAccount)} Investment Account</Header>
            <p>{msg}</p>
            <Card>
              <Card.Content className="mt-10 mb-10">
                <p><b>Account Setup</b></p>
                <Button fluid color="green" content="Continue" onClick={() => this.renderAccType()} />
              </Card.Content>
            </Card>
          </Aux>
        }
      </div>
    );
  }
}
