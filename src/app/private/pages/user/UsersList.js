import React from 'react';
import { inject, observer } from 'mobx-react';

import UserRow from './UserRow';

@inject('adminStore', 'userStore')
@observer
export default class UsersList extends React.Component {
  render() {
    if (this.props.adminStore.usersList) {
      return (
        <div className="users-list">
          <table className="ui basic right alligned table">
            <tbody>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Action</th>
              </tr>
              {this.props.adminStore.usersList.map(user => (
                <UserRow
                  fname={user.fname}
                  lname={user.lname}
                  username={user.username}
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
