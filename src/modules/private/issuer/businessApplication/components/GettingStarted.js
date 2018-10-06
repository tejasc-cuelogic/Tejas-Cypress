import React, { Component } from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DataFormatter } from '../../../../../helper';
import FireworksAnimation from '../../../../public/offering/components/investNow/agreement/components/FireworkAnimation';

@inject('businessAppReviewStore')
@withRouter
@observer
export default class GettingStarted extends Component {
  state = {
    showFireworks: true,
  }
  handleCloseModal = () => {
    this.props.history.push('/app/dashboard');
  }
  createOffer = () => {
    const { match, businessAppReviewStore } = this.props;
    businessAppReviewStore.createOffering(match.params.applicationId).then(() => {
      this.props.history.push('/app/dashboard');
    });
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    setTimeout(() => {
      this.setState({ showFireworks: false });
    }, 8500);
    return (
      <div>
        {this.state.showFireworks &&
        <FireworksAnimation />
        }
        <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Congratulations!</Header>
          </Modal.Header>
          <Modal.Content className="signup-content center-align">
            <Divider hidden />
            <div className="center-align">
              <Button
                primary
                onClick={this.createOffer}
              >Get Started
              </Button>
            </div>
            <Divider hidden />
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
