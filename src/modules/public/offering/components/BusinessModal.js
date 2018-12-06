import React, { Component } from 'react';
import { Header, Modal } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { InlineLoader } from '../../../../theme/shared';

@inject('campaignStore')
@observer
class BusinessModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    // const emptyStatement = 'Detail not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        closeIcon
        size="large"
      >
        <Header as="h3">
          Business Model
        </Header>
        <Modal.Content image scrolling>
          {
            campaign && campaign.offering && campaign.offering.about &&
              campaign.offering.about.businessModel ?
                <p
                  dangerouslySetInnerHTML={
                  {
                    __html: campaign.offering.about.businessModel,
                  }
                }
                /> : <InlineLoader text="No data found." />
          }
        </Modal.Content>
      </Modal>
    );
  }
}

export default BusinessModal;
