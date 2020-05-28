import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button, Message } from 'semantic-ui-react';
import { authActions } from '../../../services/actions';
import { ListErrors } from '../../../theme/shared';
import formHOC from '../../../theme/form/formHOC';

const metaInfo = {
    store: 'authStore',
    form: 'FORGOT_PASS_FRM',
};
function ForgotPassword(props) {
  useEffect(() => {
    props.authStore.resetForm('FORGOT_PASS_FRM');
    return () => {
      props.uiStore.reset();
    };
  }, []);
   const onSubmit = (event) => {
    event.preventDefault();
    authActions.resetPassword()
      .then(() => props.history.push('/reset-password'))
      .catch(err => window.logger(err));
  };

  const handleCloseModal = (e) => {
    e.stopPropagation();
    props.history.push(props.uiStore.authRef || '/');
  };

    const { FORGOT_PASS_FRM } = props.authStore;
    const { inProgress, errors } = props.uiStore;
    const { smartElement } = props;
    return (
      <Modal open closeIcon onClose={handleCloseModal} size="mini" closeOnDimmerClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Reset your password</Header>
          <p>
            Please enter the email address associated with your account.
            We&#39;ll send you verification code to reset your password.
          </p>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error onSubmit={onSubmit}>
            {
              Object.keys(FORGOT_PASS_FRM.fields).map(field => (
                smartElement.Input(field)
              ))
            }
            {errors
              && (
<Message error textAlign="left" className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
              )
            }
            <div className="mt-30 center-align">
              <Button primary size="large" className="very relaxed" content="Send verification code" loading={inProgress} disabled={!FORGOT_PASS_FRM.meta.isValid} />
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions className="signup-actions">
          <p><b>Back to</b> <Link to="/login">Log in</Link></p>
        </Modal.Actions>
      </Modal>
    );
}
export default inject('authStore', 'uiStore')(formHOC(observer(ForgotPassword), metaInfo));
