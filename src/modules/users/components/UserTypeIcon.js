import React from 'react';

const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  let userType = null;
  if (props.user.accountType) {
    userType = props.user.accountType.charAt(0);
    classes.push(props.user.accountType.toLowerCase());
  }

  if (props.user.accredited) {
    classes.push('accredited');
  }

  return (
    <div
      className={classes.join(' ')}
    >
      {userType}
    </div>
  );
};

export default UserTypeIcon;
