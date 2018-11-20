import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { FormInput, FormPasswordStrength } from '../../../theme/form';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';

@inject('authStore', 'uiStore')
@observer
export default class ChangePassword extends Component {
  componentWillMount() {
    this.props.authStore.setDefaultPwdType();
    this.props.authStore.resetForm('CHANGE_PASS_FRM');
  }
  onSubmit = (e) => {
    e.preventDefault();
    const method = this.props.refModule && this.props.refModule === 'security' ?
      'changeMyPassword' : 'updatePassword';
    authActions[method](this.props.refModule)
      .then(() => {
        this.props.history.goBack();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.goBack();
  }
  render() {
    // togglePasswordType
    const {
      CHANGE_PASS_FRM, changePassChange, pwdInputType, currentScore,
    } = this.props.authStore;
    const { errors, inProgress } = this.props.uiStore;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Change your Password</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={this.onSubmit}>
            {
              ['oldPasswd', 'newPasswd', 'retypePasswd'].map(field => (
                (field === 'newPasswd') ?
                  <FormPasswordStrength
                    key="newPasswd"
                    name="newPasswd"
                    type="password"
                    iconDisplay
                    minLength={8}
                    minScore={4}
                    tooShortWord="Weak"
                    scoreWords={['Weak', 'Okay', 'Good', 'Strong', 'Stronger']}
                    inputProps={{
                      name: 'newPasswd', autoComplete: 'off', placeholder: 'New Password', key: 'newPasswd',
                    }}
                    changed={changePassChange}
                    fielddata={CHANGE_PASS_FRM.fields[field]}
                  />
                  :
                  <FormInput
                    key={field}
                    type={pwdInputType}
                    // icon={(field === 'oldPasswd') ? togglePasswordType() : null}
                    name={field}
                    fielddata={CHANGE_PASS_FRM.fields[field]}
                    changed={changePassChange}
                  />
              ))
            }
            {errors &&
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={['Incorrect old password']} />
              </Message>
            }
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set new password" loading={inProgress} disabled={!CHANGE_PASS_FRM.meta.isValid || !currentScore} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
