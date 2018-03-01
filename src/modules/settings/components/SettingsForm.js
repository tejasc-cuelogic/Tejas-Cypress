import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';

import ProfileDetails from './../../../components/common/ProfileDetails';
import userActions from '../../../actions/user';

@inject('userStore')
@observer
class SettingsForm extends React.Component {
  handleChange = e => this.props.userStore.setCurrentUserAttribute(e.target.name, e.target.value);
  handleClick = () => userActions.updateProfile();

  render() {
    return (
      <Form>
        <ProfileDetails
          userData={this.props.userStore.currentUser}
          handleChange={this.handleChange}
        />
        <Button onClick={this.handleClick} color="green">
          Update Profile
        </Button>
      </Form>
    );
  }
}

export default SettingsForm;
