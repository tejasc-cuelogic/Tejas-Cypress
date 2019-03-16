import React from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Modal, Header, Button, Icon, Divider } from 'semantic-ui-react';
import Helper from '../../../../../../../helper/utility';

@inject('investmentStore', 'uiStore', 'portfolioStore', 'campaignStore', 'accreditationStore')
@withRouter
@observer
export default class Congratulation extends React.Component {
  componentWillMount() {
    if (this.props.changeInvestment) {
      this.props.uiStore.setFieldvalue('showFireworkAnimation', true);
    } else {
      this.props.campaignStore.setFieldValue('showFireworkAnimation', true);
    }
  }
  handleCloseModal = () => {
    this.props.investmentStore.resetData();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push('overview');
  }
  handleCloseModalWithRefferalLink = () => {
    this.props.investmentStore.resetData();
    this.props.accreditationStore.resetUserAccreditatedStatus();
    this.props.history.push('/app/referrals');
  }
  render() {
    const { getInvestorAccountById } = this.props.portfolioStore;
    const { investmentAmount } = this.props.investmentStore;
    const { campaign } = this.props.campaignStore;
    setTimeout(() => {
      if (this.props.changeInvestment) {
        this.props.uiStore.setFieldvalue('showFireworkAnimation', false);
      } else {
        this.props.campaignStore.setFieldValue('showFireworkAnimation', false);
      }
    }, 8500);
    return (
      <Aux>
        <Modal open closeIcon closeOnRootNodeClick={false} onClose={this.handleCloseModal}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Congratulations!</Header>
            <Header as="h3">
              You have invested <span className="positive-text">{Helper.CurrencyFormat(investmentAmount)}</span> in
              {` ${this.props.changeInvestment ? (getInvestorAccountById && getInvestorAccountById.offering.keyTerms &&
                    getInvestorAccountById.offering.keyTerms.shorthandBusinessName) : (campaign && campaign.keyTerms && campaign.keyTerms.shorthandBusinessName)}`}.
            </Header>
          </Modal.Header>
          <Modal.Content className="signup-content center-align">
            <p>
            Now, earn an additional $20 credit by giving $20. Invite your
            friends to build the community together, and you both earn credits.
            </p>
            <Divider hidden />
            <div className="center-align">
              <Button
                primary
                onClick={this.handleCloseModalWithRefferalLink}
              >Give $20 & Get $20
              </Button>
            </div>
            <Divider hidden />
            <Link to="/app/summary" className="text-link">
              <Icon className="ns-arrow-right" color="green" />
              Go to My Accounts
            </Link>
          </Modal.Content>
        </Modal>
      </Aux>
    );
  }
}
