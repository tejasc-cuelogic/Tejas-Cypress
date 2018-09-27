import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { FormInput } from '../../../theme/form';
import { authActions } from '../../../services/actions';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends Component {
  componentWillMount() {
    this.props.authStore.setDefaultPwdType();
  }
  onSubmit = (e) => {
    e.preventDefault();
    authActions.updatePassword()
      .then(() => {
        this.props.history.goBack();
      })
      .catch((err) => {
        console.log(err);
        // this.props.authStore.forceSetError(
        //   'CHANGE_PASS_FRM',
        //   'oldPasswd',
        //   'Entered password is incorrect, please try again.',
        // );
      });
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    const {
      CHANGE_PASS_FRM, changePassChange, togglePasswordType, pwdInputType,
    } = this.props.authStore;
    return (
      <div>
        <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
          <Modal.Header className="center-align signup-header">
            <Header as="h3">Change your Password</Header>
          </Modal.Header>
          <Modal.Content className="signup-content">
            <Form onSubmit={this.onSubmit}>
              {
                ['oldPasswd', 'newPasswd', 'retypePasswd'].map(field => (
                  <FormInput
                    key={field}
                    type={pwdInputType}
                    icon={(field === 'oldPasswd') ? togglePasswordType() : null}
                    name={field}
                    fielddata={CHANGE_PASS_FRM.fields[field]}
                    changed={changePassChange}
                  />
                ))
              }
              <div className="mt-30 center-align">
                <Button loading={this.props.uiStore.inProgress} disabled={!CHANGE_PASS_FRM.meta.isValid} primary size="large">Set new password</Button>
              </div>
            </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}
