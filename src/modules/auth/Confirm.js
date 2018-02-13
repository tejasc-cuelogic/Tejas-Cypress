import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Message } from 'semantic-ui-react';

import ListErrors from '../../components/common/ListErrors';
import authActions from './../../actions/auth';

@inject('authStore', 'uiStore')
@withRouter
@observer
export default class Confirm extends React.Component {
  componentWillUnmount() {
    this.props.uiStore.clearErrors();
  }

  handleCodeChange = e => this.props.authStore.setCode(e.target.value);
  handleSubmitForm = (e) => {
    e.preventDefault();
    authActions.confirmCode()
      .then(() => this.props.history.replace('/login'));
  };

  render() {
    const { inProgress } = this.props.authStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Confirm verification code</h1>
              <p className="text-xs-center">
                <Link to="login">Have an account?</Link>
              </p>
              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Code"
                      onChange={this.handleCodeChange}
                    />
                  </fieldset>
                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={inProgress}
                  >
                    Confirm
                  </button>
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
