import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Modal, Header, Divider, Form, Button } from 'semantic-ui-react';
import { FormRadioGroup } from '../../../../../../theme/form';

@inject('multiFactorAuthStore', 'uiStore')
@withRouter
@observer
export default class ManageMultiFactorAuth extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.multiFactorAuthStore.initialiseMfaMode();
    }
  }
  submit = (e) => {
    e.preventDefault();
    this.props.multiFactorAuthStore.updateMfaModeType().then(() => {
      this.props.history.push(this.props.refLink);
    });
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  }
  render() {
    const {
      MFA_MODE_TYPE_META,
      handleMfaModeTypeChanged,
    } = this.props.multiFactorAuthStore;
    const { inProgress } = this.props.uiStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Your active MFA factor</Header>
            <Divider />
            <p>
              All major actions will require additional confirmation with
              the code that we will send to your phone or e-mail address.
            </p>
          </Modal.Header>
          <Modal.Content className="signup-content center-align">
            <Header as="h4">Where do you want to get<br />the confirmation codes?</Header>
            <Form onSubmit={this.submit} className="account-type-tab">
              <FormRadioGroup
                fielddata={MFA_MODE_TYPE_META.fields.mfaModeTypes}
                name="mfaModeTypes"
                changed={handleMfaModeTypeChanged}
                containerclassname="center-align radio-basic"
                widths="equal"
              />
              <div className="mt-30 mb-20 center-align">
                <Button loading={inProgress} disabled={!MFA_MODE_TYPE_META.meta.isValid} primary size="large" className="very relaxed">Select</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
