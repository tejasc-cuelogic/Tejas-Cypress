import React, { Component } from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { DataFormatter } from '../../../../../helper';

@inject('uiStore', 'offeringsStore')
@withRouter
@observer
export default class GettingStarted extends Component {
  constructor(props) {
    super(props);
    this.props.uiStore.setFieldvalue('showFireworkAnimation', true);
  }

  handleCloseModal = () => {
    this.props.offeringsStore.initRequest({ stage: 'active' }, true);
    this.props.history.push('/app');
  }

  module = name => DataFormatter.upperCamelCase(name);

  render() {
    setTimeout(() => {
      this.props.uiStore.setFieldvalue('showFireworkAnimation', false);
    }, 8500);
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h2">Congratulations!</Header>
        </Modal.Header>
        <Modal.Content className="signup-content center-align">
          <Divider hidden />
          <div className="center-align">
            <Button
              loading={this.props.uiStore.inProgress}
              primary
              onClick={this.handleCloseModal}
            >Get Started
            </Button>
          </div>
          <Divider hidden />
        </Modal.Content>
      </Modal>
    );
  }
}
