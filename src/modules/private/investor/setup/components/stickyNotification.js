import React, { Component } from 'react';
import { Card, Statistic, Button, Icon } from 'semantic-ui-react';
import { get } from 'lodash';

const isMobile = document.documentElement.clientWidth < 768;

const notificationCard = {
  verifyAccreditation: {
    message:
    <span>
          Are you an accredited investor? Go through the steps to verify your status
          today, and for a limited time, we will add a $100 credit to your account.
      <br /><a target="_blank" href="/agreements/Accredited-Investor-Verification-Incentive-Program-Terms-and-Conditions">See Rules</a>
    </span>,
    btnText: 'Verify',
    header: 'Earn $100 by verifying your accredited investor status',
  },
  verifiedAccreditation: {
    message:
    <span>
       Earn a $20 referral credit for every person who signs up using your code. They get a $20 credit as well. Build the community together
      <br />
    </span>,
    btnText: 'Refer',
    header: 'Refer friends to NextSeed',
  },
};
export default class StickyNotification extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.initiateAccreditation();
  }

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

  handleReferral = () => {
    this.props.history.push('/app/referrals');
  }

  isUserAccreditated = () => {
    const { accreditationData } = this.props.userDetailsStore;
    const accreditationStatusArr1 = Object.keys(accreditationData).map(a => accreditationData[a] && accreditationData[a].status);
    const accreditationStatusArr2 = ['CONFIRMED', 'REQUESTED', 'EXPIRED', 'INVALID'];
    return accreditationStatusArr1.some(item => accreditationStatusArr2.includes(item));
  }

  getNotificationCard = () => {
    if (this.isUserAccreditated()) {
      notificationCard.verifiedAccreditation.onClick = this.handleReferral;
      return notificationCard.verifiedAccreditation;
    }
    notificationCard.verifyAccreditation.onClick = this.handleVerifyAccreditation;
    return notificationCard.verifyAccreditation;
  }

  render() {
    const cardData = this.getNotificationCard();
    return (
      <div className="closable-card">
        <Button onClick={this.props.onCloseSticky} icon className="link-button">
          <Icon className="ns-close-light" />
        </Button>
        <Card fluid raised>
          <Card.Content>
            <Statistic size="tiny" className="cta">
              {get(this.props, 'notificationCard.congratulations')
                ? <p className="intro-text text-uppercase"><b>{get(this.props, 'notificationCard.congratulations')}</b></p> : ''
              }
               <Statistic.Value>{cardData.header}</Statistic.Value>
                <Statistic.Label>{cardData.message}</Statistic.Label>
            </Statistic>
            <div className={`${isMobile ? 'ml-18' : ''} center-align`}>
            <Button onClick={e => cardData.onClick(e)} className={isMobile && 'mt-20'} compact color="green">{cardData.btnText}</Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }
}
