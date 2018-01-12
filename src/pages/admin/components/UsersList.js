import React from 'react';

import UserRow from './UserRow';

const UsersList = (props) => {
  if (props.usersList) {
    return (
      <table>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Username</th>
          <th>Action</th>
        </tr>
        {props.usersList.map(user => (
          <UserRow fname={user.fname} lname={user.lname} username={user.username} />
        ))}
      </table>
    );
  }
  return (
    <div>
      <p>No Users Found</p>
    </div>
  );
};

export default UsersList;
