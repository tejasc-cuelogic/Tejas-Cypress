import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';

import PersonalDetails from './../common/personalDetails';

@inject('userStore')
@observer
class SettingsForm extends React.Component {
  handleChange = e => this.props.userStore.setCurrentUserAttribute(e.target.name, e.target.value);

  render() {
    return (
      <Form>
        <PersonalDetails
          userData={this.props.userStore.currentUser}
          handleChange={this.handleChange}
        />
        <Button onClick={this.handleClick}>
          Update Settings
        </Button>
      </Form>
    );
  }
}

export default SettingsForm;
