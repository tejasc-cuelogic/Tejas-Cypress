import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, Message } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore', 'uiStore')
@observer
export default class ResetPassword extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handlePasswordChange = event => this.props.authStore.setPassword(event.target.value);
  handleVerifyChange = event => this.props.authStore.setVerify(event.target.value);
  handleCodeChange = event => this.props.authStore.setCode(event.target.value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    this.props.authStore.setNewPassword().then(() => this.props.history.push('/login'));
  }

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Reset Password</h1>
              <p>The verification code has been sent to your registered email address</p>

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="New Password"
                      value={values.password}
                      onChange={this.handlePasswordChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Verify Password"
                      value={values.verify}
                      onChange={this.handleVerifyChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Verification Code"
                      value={values.verificationCode}
                      onChange={this.handleCodeChange}
                    />
                  </fieldset>

                  <Button primary disabled={inProgress}>
                    Reset Password
                  </Button>
                  {errors &&
                    <Message error textAlign="left">
                      <ListErrors errors={[errors.message]} />
                    </Message>
                  }
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
