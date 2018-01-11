import React from 'react';

const UserRow = (props) => {
  console.log('tt');
  return (
    <tr>
      <td>{ props.fname }</td>
      <td>{ props.lname }</td>
      <td>{ props.username }</td>
      <td>Disable</td>
    </tr>
  );
};

export default UserRow;
