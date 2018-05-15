import React from 'react';
import Aux from 'react-aux';

const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  if (props.user.accreditation === 'yes') {
    classes.push('accredited');
  }

  return (
    <Aux>
      {
        props.user.accountType.map(type => (
          <div key={type} className={`${classes.join(' ')} ${type}`}>
            {type.toUpperCase().charAt(0)}
          </div>
        ))
      }
    </Aux>
  );
};

export default UserTypeIcon;
