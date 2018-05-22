import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid, Header } from 'semantic-ui-react';

import ListErrors from './../../../theme/common/ListErrors';
import SettingsForm from './../components/SettingsForm';
import authActions from './../../../actions/auth';
// import userActions from './../../../../actions/user';

@inject('userStore', 'authStore')
@withRouter
@observer
class Settings extends React.Component {
  handleClickLogout = () =>
    authActions.logout().then(() => this.props.history.replace('/'));

  render() {
    return (
      <div>
        <div className="page-header-section">
          <Header as="h1">Your Settings</Header>
        </div>
        <div className="login-form content-spacer">
          <Grid
            textAlign="center"
            verticalAlign="middle"
          >
            <Grid.Column>
              <ListErrors errors={this.props.userStore.updatingUserErrors} />
              <SettingsForm
                currentUser={this.props.userStore.currentUser}
                onSubmitForm={user => this.props.userStore.updateUser(user)}
              />
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Settings;
