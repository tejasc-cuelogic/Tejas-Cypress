import React from 'react';
import { observer, inject } from 'mobx-react';

import UserRow from './components/UserRow';

@inject('adminStore')
@observer
export default class UsersList extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Action</th>
        </tr>
        {this.props.adminStore.usersList.map(user => (
          <UserRow fname={user.fname} lname={user.lname} username={user.username} />
        ))}
      </table>
    );
  }
}
