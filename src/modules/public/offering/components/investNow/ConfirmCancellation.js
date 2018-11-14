import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

@inject('investmentStore', 'portfolioStore')
@withRouter
@observer
export default class ConfirmCancellation extends Component {
  handleBack = () => {
    this.props.history.push(`${this.props.refLink}/agreement`);
  }
  handleConfirm = () => {
    const { agreementDetails } = this.props.investmentStore;
    const { cancelAgreement } = this.props.portfolioStore;
    cancelAgreement(agreementDetails.agreementId);
    this.props.history.push(`${this.props.refLink}/invest-now`);
  }
  render() {
    return (
      <Modal open closeOnDimmerClick={false} size="mini">
        <Modal.Content className="center-align">
          <Header as="h3">Confirm cancellation</Header>
          <p>By canceling this reservation, you will not be invested in this offering.</p>
          <div className="center-align">
            <Button.Group>
              <Button primary content="Back" onClick={this.handleBack} />
              <Button color="gray" content="Confirm" onClick={this.handleConfirm} />
            </Button.Group>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}
