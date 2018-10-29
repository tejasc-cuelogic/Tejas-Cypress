import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { find, toInteger } from 'lodash';
import { Modal, Button, Header, Form, Divider, Message, Icon } from 'semantic-ui-react';
import OfferingInvestDetails from './financialInfo/OfferingInvestDetails';
import { ListErrors } from '../../../../../../theme/shared';

@inject('uiStore', 'portfolioStore')
@withRouter
@observer
export default class CancelInvestment extends Component {
  state = {
    btnCancel: '',
  }
  componentWillMount() {
    const { setInitialLinkValue } = this.props.portfolioStore;
    setInitialLinkValue(false);
    this.props.uiStore.clearErrors();
  }

  submit = (e) => {
    e.preventDefault();
    const { cancelAgreement } = this.props.portfolioStore;
    const buttonValue = this.state.btnCancel;
    if (buttonValue === 'btnCancel') {
      cancelAgreement(this.props.match.params.id);
    } else {
      const location = `${this.props.refLink}/preview`;
      this.props.history.push(location);
    }
    // this.props.beneficiaryStore.setShareModalData(true);
  }

  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  }

  handleClick = (val) => {
    this.setState({ btnCancel: val });
  }

  render() {
    const { inProgress, errors } = this.props.uiStore;
    const { isCancelShowLink, getInvestorAccounts } = this.props.portfolioStore;
    const pendingList = getInvestorAccounts && getInvestorAccounts.investments &&
      getInvestorAccounts.investments.pending ? getInvestorAccounts.investments.pending : [];
    const investmentOfferingDetails =
      find(pendingList, { agreementId: toInteger(this.props.match.params.id) });
    return (
      <Modal size="small" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Do you want to cancel this investment?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <OfferingInvestDetails
            offering={investmentOfferingDetails || null}
            accType="individual"
            disabledClass={isCancelShowLink ? 'disabled' : ''}
          />
          {!isCancelShowLink ?
            <Form error onSubmit={this.submit}>
              <div className="center-align mt-40">
                <Button loading={inProgress} color="red" id="btnCancel" onClick={() => { this.handleClick('btnCancel'); }}>Yes, cancel investment</Button>
                <Button color="green" id="btnNotCancel" onClick={() => { this.handleClick('btnNotCancel'); }}>No, keep investment</Button>
              </div>
            </Form>
            :
            <div className="center-align mt-40">
              <Link to="/app/account-details/individual/portfolio" className="back-link"><Icon className="ns-arrow-right" />Go to My Dashboard</Link>
            </div>
          }
        </Modal.Content>
      </Modal>
    );
  }
}
