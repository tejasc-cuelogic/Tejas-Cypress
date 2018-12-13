import React, { Component } from 'react';
import { Modal } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Parser from 'html-react-parser';
import { InlineLoader } from '../../../../../../theme/shared';

@inject('campaignStore')
@observer
class SummaryModal extends Component {
  state = { activeIndex: 0 }
  handleClose = () => this.props.history.goBack();

  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  }

  render() {
    const { campaign } = this.props.campaignStore;
    const revenueShareSummary =
    (campaign && campaign.keyTerms && campaign.keyTerms.revShareSummary) || null;
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Revenue Sharing Summary*</Modal.Header>
        <Modal.Content scrolling>
          {revenueShareSummary ?
            <p>
              {Parser(revenueShareSummary)}
            </p>
          : <InlineLoader text="No data available" />
          }
        </Modal.Content>
      </Modal>
    );
  }
}

export default SummaryModal;
