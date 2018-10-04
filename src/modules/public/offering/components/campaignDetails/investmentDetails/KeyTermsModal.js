import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import RevenueSharingKeyTerms from './RevenueSharingKeyTerms';
import TermNoteKeyTerms from './TermNoteKeyTerms';
import { CAMPAIGN_KEYTERMS_SECURITIES } from '../../../../../../constants/offering';

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
        {campaign.keyTerms.securities === CAMPAIGN_KEYTERMS_SECURITIES.REVENUE_SHARING_NOTE ?
          <RevenueSharingKeyTerms KeyTerms={campaign.keyTerms} />
          : <TermNoteKeyTerms KeyTerms={campaign.keyTerms} />
          }
      </Modal>
    );
  }
}

export default KeyTerms;
