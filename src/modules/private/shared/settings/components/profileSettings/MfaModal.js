import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Form, Button } from 'semantic-ui-react';
// import { FormRadioGroup } from '../../../../../../theme/form';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends Component {
  onSubmit = (e) => {
    e.preventDefault();
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    // const { CHANGE_PASS_FRM, changePassChange } = this.props.authStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h2">Your active MFA factor</Header>
            <Divider />
            <p>
              All major actions will require additional confirmation with
              the code that we will send to your phone or e-mail address.
            </p>
          </Modal.Header>
          <Modal.Content className="signup-content center-align">
            <Header as="h3">Where do you want to get<br />the confirmation codes?</Header>
            <Form error className="account-type-tab">
              test
              <div className="mt-30 center-align">
                <Button loading={this.props.uiStore.inProgress} primary size="large" className="very relaxed">Select</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
