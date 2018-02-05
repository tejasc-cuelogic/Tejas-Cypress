import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore', 'uiStore')
@observer
export default class ForgotPassword extends React.Component {
  componentWillMount() {
    if (this.props.authStore.errors) {
      this.props.authStore.clearErrors();
    }
  }

  handleEmailChange = event => this.props.authStore.setEmail(event.target.value);
  handleSubmitForm = (event) => {
    event.preventDefault();
    this.props.authStore.resetPassword().then(() => this.props.history.push('/reset-password'));
  }

  render() {
    const { values, inProgress } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Reset your Password</h1>
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
                    <Button color="green" disabled={inProgress}>
                      Proceed
                    </Button>
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
