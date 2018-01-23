import React from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import UserRow from './components/UserRow';
import adminActions from './../../../../actions/adminActions';

@inject('adminStore', 'userStore')
@observer
export default class UsersList extends React.Component {
  componentDidMount() {
    adminActions.listUsers();
  }

  handleDisableClick = (e) => {
    adminActions.disableUser(e.target.dataUsername);
  }

  render() {
    if (this.props.adminStore.usersList) {
      return (
        <div>
          <Button as={Link} to="/admin/user/new">Add New User</Button>
          <table className="ui basic right alligned table">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th colSpan="3">Action</th>
              </tr>
              {this.props.adminStore.usersList.map(user => (
                <UserRow
                  {...user}
                  handleDisableClick={this.handleDisableClick}
                  key={`key_${user.username}`}
                />
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    return (
      <div>
        <p>No Users Found</p>
      </div>
    );
  }
}
