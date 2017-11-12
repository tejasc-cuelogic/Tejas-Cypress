import { withRouter } from 'react-router-dom';
import ListErrors from '../../components/common/ListErrors';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';

@inject('authStore')
@withRouter
@observer
export default class Confirm extends React.Component {
  handleCodeChange = e => this.props.authStore.setCode(e.target.value);
  handleUsernameChange = e => this.props.authStore.setUsername(e.target.value);
  handleSubmitForm = e => {
    e.preventDefault();
    this.props.authStore
      .confirmCode()
      .then(() => this.props.history.replace('/login'));
  };

  render() {
    const { values, errors, inProgress } = this.props.authStore;

    return (
      <div className='auth-page'>
        <div className='container page'>
          <div className='row'>
            <div className='col-md-6 offset-md-3 col-xs-12'>
              <h1 className='text-xs-center'>Confirm verification code</h1>
              <p className='text-xs-center'>
                <Link to='login'>Have an account?</Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={this.handleSubmitForm}>
                <fieldset>
                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='text'
                      placeholder='Username'
                      value={values.username}
                      onChange={this.handleUsernameChange}
                    />
                  </fieldset>

                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='text'
                      placeholder='Code'
                      onChange={this.handleCodeChange}
                    />
                  </fieldset>
                  <button
                    className='btn btn-lg btn-primary pull-xs-right'
                    type='submit'
                    disabled={inProgress}
                  >
                    Confirm
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
