import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';

import ProfileDetails from './../common/ProfileDetails';

@inject('userStore')
@observer
class SettingsForm extends React.Component {
  handleChange = e => this.props.userStore.setCurrentUserAttribute(e.target.name, e.target.value);

  render() {
    return (
      <Form>
        <ProfileDetails
          userData={this.props.userStore.currentUser}
          handleChange={this.handleChange}
        />
        <Button onClick={this.handleClick}>
          Update Profile
        </Button>
      </Form>
    );
  }
}

export default SettingsForm;
