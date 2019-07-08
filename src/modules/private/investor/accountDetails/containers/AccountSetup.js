import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Card, Button, Statistic } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { includes, capitalize } from 'lodash';

const isMobile = document.documentElement.clientWidth < 768;
@inject('userDetailsStore', 'uiStore')
@withRouter
@observer
export default class AccountSetup extends Component {
  componentWillMount() {
    const { setFieldValue } = this.props.userDetailsStore;
    const accountType = includes(this.props.location.pathname, 'individual') ? 'individual' : includes(this.props.location.pathname, 'ira') ? 'ira' : 'entity';
    setFieldValue('currentActiveAccount', accountType);
    this.props.uiStore.clearErrors();
  }

  renderAccType = () => {
    const { currentActiveAccount } = this.props.userDetailsStore;
    this.props.history.push(`/app/setup/account-creation/${currentActiveAccount}`);
  }

  render() {
    const { currentActiveAccount } = this.props.userDetailsStore;
    return (
      <div className={includes(this.props.location.pathname, 'transactions') ? 'content-spacer' : ''}>
        {
      <div className="closable-card">
                  <Card fluid raised>
          <Card.Content>
            <Statistic size="tiny" className="cta">
              <Statistic.Value className="mb-half">You&apos;re almost there!</Statistic.Value>
              <Statistic.Label>Once you finish setting up your {currentActiveAccount === 'ira' ? currentActiveAccount.toUpperCase() : capitalize(currentActiveAccount)} Account, you can begin investing on NextSeed.</Statistic.Label>
            </Statistic>
            <div className="center-align">
              <Button onClick={() => this.renderAccType()} className={isMobile && 'mt-20'} compact color="green">Continue</Button>
            </div>
          </Card.Content>
        </Card>
        </div>
        }
      </div>
    );
  }
}
