import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import shortid from 'shortid';

import { USER_ROLES } from './../../../../constants/user';
import adminActions from './../../../../actions/admin';
import ProfileDetails from './../common/ProfileDetails';

@inject('adminStore', 'userStore')
@observer
export default class Profile extends React.Component {
  componentWillMount() {
    const userAttr = this.props.adminStore.usersList[this.props.match.params.userId];
    if (userAttr) {
      this.props.userStore.setUser({
        givenName: userAttr.given_name,
        familyName: userAttr.family_name,
        email: userAttr.email,
        roles: JSON.parse(userAttr['custom:roles']),
        status: userAttr.status,
        emailVerified: userAttr.email_verified,
        username: userAttr.username,
      });
    }
  }

  componentWillUnmount() {
    this.props.userStore.resetUserAttributes();
  }

  handleChange = e => this.props.userStore.setUserAttribute(e.target.name, e.target.value);
  handleRoleChange = (e) => {
    if (e.target.checked) {
      this.props.userStore.addRole(e.target.value);
    } else {
      this.props.userStore.removeRole(e.target.value);
    }
  }
  handleSubmit = () => adminActions.updateUserAttributes();

  render() {
    const { userAttributes } = this.props.userStore;
    return (
      <div>
        <Form>
          <ProfileDetails
            userData={userAttributes}
            handleChange={this.handleChange}
          />
          <Form.Group>
            {
              USER_ROLES.map(role => (
                <Form.Field
                  type="checkbox"
                  control="input"
                  label={role}
                  value={role}
                  checked={userAttributes.roles.includes(role)}
                  key={shortid.generate()}
                  onChange={this.handleRoleChange}
                />
              ))
            }
          </Form.Group>
          <Button primary onClick={this.handleSubmit}>Save</Button>
        </Form>
      </div>
    );
  }
}
