import { Link } from 'react-router-dom';
import React from 'react';
import { inject, observer } from 'mobx-react';
import ListErrors from '../../../components/common/ListErrors';

@inject('authStore')
@observer
export default class Register extends React.Component {
  componentWillUnmount() {
    this.props.authStore.reset();
  }

  handleFirstNameChange = e => this.props.authStore.setFirstName(e.target.value);
  handleLastNameChange = e => this.props.authStore.setLastName(e.target.value);
  handleEmailChange = e => this.props.authStore.setEmail(e.target.value);
  handlePasswordChange = e => this.props.authStore.setPassword(e.target.value);
  handleVerifyChange = e => this.props.authStore.setVerify(e.target.value);
  handleRoleChange = e => this.props.authStore.setRole(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore
      .register()
      .then(() => this.props.history.replace('/confirm'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="login">Have an account?</Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="First Name"
                      value={values.fname}
                      onChange={this.handleFirstNameChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Last Name"
                      value={values.lname}
                      onChange={this.handleLastNameChange}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
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
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Verify Password"
                      value={values.verify}
                      onChange={this.handleVerifyChange}
                    />
                  </fieldset>
                  <fieldset className="form-group">
                    <select className="ui dropdown" onChange={this.handleRoleChange}>
                      <option value="">Role</option>
                      <option value="bowner">Business Owner</option>
                      <option value="investor">Investor</option>
                    </select>
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={inProgress}
                  >
                    Sign up
                  </button>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
