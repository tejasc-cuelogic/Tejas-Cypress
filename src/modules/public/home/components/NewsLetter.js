import React, { Component } from 'react';
import { inject } from 'mobx-react';
import { Modal, Header } from 'semantic-ui-react';
import SubscribeForNewsletter from '../../shared/components/SubscribeForNewsletter';

@inject('authStore', 'uiStore')
export default class NewsLetter extends Component {
  render() {
    const { reset } = this.props.authStore;
    return (
      <Modal
        size="mini"
        open
        onClose={() => {
          reset('NEWSLETTER');
          this.props.history.push('/');
        }
        }
      >
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Sign Up for Newsletter</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <SubscribeForNewsletter modal />
        </Modal.Content>
      </Modal>
    );
  }
}
