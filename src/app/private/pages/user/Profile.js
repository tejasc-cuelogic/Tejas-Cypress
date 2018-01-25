import React from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Button } from 'semantic-ui-react';
import shortid from 'shortid';

import { USER_ROLES } from './../../../../constants/user';
import adminActions from './../../../../actions/admin';

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
          <Form.Field label={`User ID : ${userAttributes.username}`} />
          <Form.Group>
            <Form.Input
              type="text"
              label="First Name"
              placeholder="First Name"
              name="givenName"
              value={userAttributes.givenName}
              onChange={this.handleChange}
            />
            <Form.Input
              type="text"
              label="Last Name"
              placeholder="Last Name"
              name="familyName"
              value={userAttributes.familyName}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Field label={`Email: ${userAttributes.email}`} />
          </Form.Group>
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
          <Button color="green" onClick={this.handleSubmit}>Save</Button>
        </Form>
      </div>
    );
  }
}
