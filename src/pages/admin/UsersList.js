import React from 'react';
import { inject, observer } from 'mobx-react';

import UserRow from './components/UserRow';

@inject('adminStore', 'userStore')
@observer
export default class UsersList extends React.Component {
  render() {
    if (this.props.adminStore.usersList) {
      return (
        <table className="ui celled table table-centered">
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
      );
    }
    return (
      <div>
        <p>No Users Found</p>
      </div>
    );
  }
}
