import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import ListErrors from '../../components/common/ListErrors';


@inject('authStore')
@withRouter
@observer
export default class Login extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.login().then(() => this.props.history.replace('/'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="register">Need an account?</Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={values.username}
                      onChange={this.handleUsernameChange}
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

                  <Button primary disabled={inProgress}>
                    Sign in
                  </Button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
