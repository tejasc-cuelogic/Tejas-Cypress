import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import Parser from 'html-react-parser';
import { Modal, Header, List, Icon, Divider } from 'semantic-ui-react';

@inject('campaignStore')
@observer
class CompanyDescriptionModal extends Component {
  handleClose = () => this.props.history.goBack();

  render() {
    const { campaign } = this.props.campaignStore;
    const emptyStatement = 'Detail not found';
    const emptyHistoryStatement = 'History not found';
    return (
      <Modal
        open
        onClose={this.handleClose}
        size="large"
        closeIcon
      >
        <Modal.Header>Company Description</Modal.Header>
        <Modal.Content scrolling>
          <Aux>
            {
              campaign && campaign.offering && campaign.offering.about &&
                campaign.offering.about.theCompany ?
                  <p className="detail-section">
                    {Parser(campaign.offering.about.theCompany)}
                  </p>
                :
                  <p>{emptyStatement}</p>
            }
          </Aux>
          <Divider section />
          <div className="history-section">
            <Header as="h4">History</Header>
            {
              campaign && campaign.offering && campaign.offering.about &&
                campaign.offering.about.history && campaign.offering.about.history.length ?
                  <List>
                    {
                    campaign.offering.about.history.map(data => (
                      <List.Item className="mb-10">
                        <Icon className="ns-flag-line" color="green" />
                        <List.Content>
                          <List.Header>{data.date}</List.Header>
                          <List.Description>
                            {data.description}
                          </List.Description>
                        </List.Content>
                      </List.Item>
                    ))
                  }
                  </List>
                :
                  <p>{emptyHistoryStatement}</p>
            }
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default CompanyDescriptionModal;
