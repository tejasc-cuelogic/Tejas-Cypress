import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Header, Card, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes } from 'lodash';
import Aux from 'react-aux';

@withRouter
@observer
export default class AccountSetup extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    if (this.props.match.isExact) {
      this.props.transactionStore.getInvestorAvailableCash();
    }
    this.props.uiStore.clearErrors();
  }
  render() {
    return (
      <div>
        {
          <Aux>
            <Header as="h4">Account Setup</Header>
            <Card fluid className="verification">
              <Card.Content>
                <p><b>Account Setup</b></p>
                <Button
                  color="green"
                  content="Continue"
                />
              </Card.Content>
            </Card>
          </Aux>
        }
      </div>
    );
  }
}
