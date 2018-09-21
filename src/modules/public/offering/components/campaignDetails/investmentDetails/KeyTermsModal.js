import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import RevenueSharingKeyTerms from './RevenueSharingKeyTerms';
import TermNoteKeyTerms from './TermNoteKeyTerms';

@inject('campaignStore')
@observer
class KeyTerms extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Key Terms</Modal.Header>
        {campaign.investmentType === 'Revenue Sharing' ?
          <RevenueSharingKeyTerms /> : <TermNoteKeyTerms />
          }
      </Modal>
    );
  }
}

export default KeyTerms;
