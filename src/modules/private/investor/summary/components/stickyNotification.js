import React, { Component } from 'react';
import { Card, Statistic, Button } from 'semantic-ui-react';
import { get } from 'lodash';


export default class StickyNotification extends Component {
  handleVerifyAccreditation = (e) => {
    e.preventDefault();
    const url = '/app/profile-settings/investment-limits';
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
      this.props.history.push('/app/profile-settings/investment-limits');
    }
  }

  render() {
    const { props } = this;
    return (
      <div className="top-cta-section">
        <div className="sticky-notification">
          <Card fluid raised>
            <Card.Content>
              <Card.Meta>{get(props, 'notificationCard.congratulations')}</Card.Meta>
              <Statistic size="mini" className="cta">
                <Statistic.Value className="mb-10">{get(props, 'notificationCard.header')}</Statistic.Value>
                <Statistic.Label>{get(props, 'notificationCard.message')}</Statistic.Label>
              </Statistic>
              <Button onClick={e => this.handleVerifyAccreditation(e)} floated="right" compact color="green">Verify</Button>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }
}
