import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form } from 'semantic-ui-react';
import moment from 'moment';

@inject('offeringCreationStore')
@observer
export default class UpdateBonusReward extends Component {
  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }
  render() {
    const { bonusRewards } = this.props;
    const { rewardId } = this.props.match.params;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Edit bonus reward</Header>
        </Modal.Header>
        {
          <Modal.Content className="signup-content">
            <Form>
              {
                bonusRewards.data.getBonusRewards &&
                bonusRewards.data.getBonusRewards.map((reward) => {
                  if (reward.id === rewardId) {
                    return (
                      <div className="reward-wrap">
                        <Header as="h5">{reward.title}</Header>
                        <p>{reward.description}</p>
                        <p>Exp Date: {moment(reward.expirationDate).format('MMM D, YYYY')}</p>
                      </div>
                    );
                  }
                  return null;
                })
              }
            </Form>
          </Modal.Content>
        }
      </Modal>
    );
  }
}
