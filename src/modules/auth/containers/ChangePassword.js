import React, { useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { mapValues, get } from 'lodash';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';
import formHOC from '../../../theme/form/formHOC';

const metaInfo = {
  store: 'authStore',
  form: 'CHANGE_PASS_FRM',
};
function ChangePassword(props) {
  useEffect(() => {
    const { setDefaultPwdType, resetForm } = props.authStore;
    const loginData = mapValues(props.authStore.LOGIN_FRM.fields, f => f.value);
    if (props.refModule !== 'security' && loginData.email === '') {
      props.history.push('/login');
    }
    setDefaultPwdType();
    resetForm('CHANGE_PASS_FRM');
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const method = props.refModule && props.refModule === 'security'
      ? 'changeMyPassword' : 'updatePassword';
    authActions[method](props.refModule)
      .then(() => {
        authActions.logout('updatedPassword').then(() => {
          props.history.push('/login');
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    props.uiStore.clearErrors();
    props.history.goBack();
  };

    const {
      CHANGE_PASS_FRM, changePassChange, pwdInputType, currentScore,
    } = props.authStore;
    const { errors, inProgress } = props.uiStore;
    const { smartElement } = props;
    return (
      <Modal open closeIcon onClose={handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Change your Password</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={onSubmit}>
            {
              ['oldPasswd', 'newPasswd', 'retypePasswd'].map(field => (
                (field === 'newPasswd')
                  ? (
                    smartElement.FormPasswordStrength(field, { scoreWords: ['Weak', 'Okay', 'Good', 'Strong', 'Stronger'],
                      inputProps: { name: 'newPasswd', autoComplete: 'off', placeholder: 'New Password', key: 'newPasswd' },
                      changed: changePassChange })
                  )
                  : (
                    smartElement.Input(field, { type: pwdInputType })
                  )
              ))
            }
            {errors
              && (
              <Message error textAlign="left" className="mt-30">
                <ListErrors errors={get(errors, 'code') === 'NotAuthorizedException' ? ['Incorrect old password'] : [get(errors, 'message')]} />
              </Message>
              )
            }
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Set new password" loading={inProgress} disabled={!CHANGE_PASS_FRM.meta.isValid || !currentScore} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
}
export default inject('authStore', 'uiStore')(formHOC(observer(ChangePassword), metaInfo));
