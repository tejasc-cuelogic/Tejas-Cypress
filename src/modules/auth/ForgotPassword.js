import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';

@inject('authStore')
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
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <div className="ui input focus">

                <ListErrors errors={errors} />

                <form onSubmit={this.handleSubmitForm}>
                  <fieldset>
                    <fieldset className="form-group">
                      <input
                        type="text"
                        placeholder="Email"
                        value={values.email}
                        onChange={this.handleEmailChange}
                      />
                    </fieldset>
                    <Button primary disabled={inProgress}>
                      Proceed
                    </Button>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
