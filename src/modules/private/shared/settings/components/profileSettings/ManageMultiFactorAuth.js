import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Form, Button } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';

@inject('multiFactorAuthStore', 'uiStore')
@observer
export default class ManageMultiFactorAuth extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.multiFactorAuthStore.setMfaModeType();
    // this.props.multiFactorAuthStore.setMfaModeType().then(() => {
    //   const location = `${this.props.match.url}/confirm`;
    //   this.props.history.push(location);
    // });
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const { MFA_MODE_TYPE_META, handleMfaModeTypeChanged } = this.props.multiFactorAuthStore;
    const { inProgress } = this.props.uiStore;
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
            <Form onSubmit={this.submit} error className="account-type-tab">
              <FormRadioGroup
                fielddata={MFA_MODE_TYPE_META.fields.mfaModeTypes}
                name="mfaModeTypes"
                changed={handleMfaModeTypeChanged}
                containerclassname="button-radio center-align"
              />
              <div className="mt-30 center-align">
                <Button loading={inProgress} primary size="large" className="very relaxed">Select</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
