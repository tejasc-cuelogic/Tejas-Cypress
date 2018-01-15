import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import ListErrors from '../../../components/common/ListErrors';
import SettingsForm from './components/SettingsForm';

@inject('userStore', 'authStore')
@withRouter
@observer
class Settings extends React.Component {
  handleClickLogout = () =>
    this.props.authStore.logout().then(() => this.props.history.replace('/'));

  render() {
    return (
      <div className="settings-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Your Settings</h1>

              <ListErrors errors={this.props.userStore.updatingUserErrors} />

              <SettingsForm
                currentUser={this.props.userStore.currentUser}
                onSubmitForm={user => this.props.userStore.updateUser(user)}
              />

              <hr />

              <button
                className="btn btn-outline-danger"
                onClick={this.handleClickLogout}
              >
                Or click here to logout.
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
