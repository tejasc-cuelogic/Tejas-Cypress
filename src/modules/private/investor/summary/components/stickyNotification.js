import React, { Component } from 'react';
import { Card, Statistic, Button, Icon } from 'semantic-ui-react';
import { get } from 'lodash';

const isMobile = document.documentElement.clientWidth < 768;
export default class StickyNotification extends Component {
  handleVerifyAccreditation = (e) => {
    e.preventDefault();
    const url = '/app/account-settings/investment-limits';
    const { accountType, accountId, multipleAccounts } = this.props;
    if (!multipleAccounts) {
      if (accountType === 'entity') {
        if (this.props.userDetailsStore.isEntityTrust) {
          this.props.history.push(`${url}/verify-trust-entity-accreditation/${accountId}/${accountType}`);
        } else {
          this.props.history.push(`${url}/verify-entity-accreditation/${accountId}/${accountType}`);
        }
      } else {
        this.props.history.push(`${url}/verify-accreditation/${accountId}/${accountType}`);
      }
    } else {
      this.props.history.push('/app/account-settings/investment-limits');
    }
  }

  render() {
    const { props } = this;
    return (
      <div className="closable-card">
        <Button icon className="link-button">
          <Icon className="ns-close-light" />
        </Button>
        <Card fluid raised>
          <Card.Content>
            <Statistic size="tiny" className="cta">
              {get(props, 'notificationCard.congratulations')
                ? <p className="intro-text text-uppercase"><b>{get(props, 'notificationCard.congratulations')}</b></p> : ''
              }
              <Statistic.Value className="mb-half">{get(props, 'notificationCard.header')}</Statistic.Value>
              <Statistic.Label>{get(props, 'notificationCard.message')}</Statistic.Label>
            </Statistic>
            <div className="center-align">
              <Button onClick={e => this.handleVerifyAccreditation(e)} className={isMobile && 'mt-20'} compact color="green">Verify</Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
