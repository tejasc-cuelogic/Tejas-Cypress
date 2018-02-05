import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import authActions from './../../actions/auth';
import ListErrors from '../../components/common/ListErrors';


@inject('authStore', 'uiStore', 'userStore')
@withRouter
@observer
export default class Login extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.login(this.props.authStore.values)
      .then(() => {
        if (this.props.authStore.newPasswordRequired) {
          this.props.history.push('/change-password');
        } else if (this.props.userStore.currentUser.roles.includes('admin')) {
          this.props.history.push('/admin/users');
        } else if (this.props.userStore.currentUser.roles.includes('bowner')) {
          this.props.history.push('/business');
        } else if (this.props.userStore.currentUser.roles.includes('investor')) {
          this.props.history.push('/investor');
        } else {
          this.props.history.replace('/');
        }
      });
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    const { errors } = this.props.uiStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="register">Need an account?</Link>
              </p>

              <ListErrors errors={errors ? [errors.message] : []} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Email"
                      value={values.email}
                      onChange={this.handleEmailChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={this.handlePasswordChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <Button
                      color="green"
                      type="submit"
                      disabled={inProgress}
                    >
                      Sign in
                    </Button>
                    <Link to="forgot-password" className="btn btn-link pull-xs-right">Forgot Password?</Link>
                  </fieldset>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
