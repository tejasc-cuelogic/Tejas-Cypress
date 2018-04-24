import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Grid } from 'semantic-ui-react';

import ListErrors from './../../../components/common/ListErrors';
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
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>Your Settings</h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="login-form content-spacer">
          {/* <Header as="h1" textAlign="center">Your Settings</Header> */}
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
              {/* <hr /> */}
              {/* <button
                className="btn btn-outline-danger"
                onClick={this.handleClickLogout}
              >
                Or click here to logout.
              </button> */}
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Settings;
