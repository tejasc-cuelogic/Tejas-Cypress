import React from 'react';
import Aux from 'react-aux';

const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  if (props.accreditation === 'yes') {
    classes.push('accredited');
  }

  return (
    <Aux>
      {
        props.items.map(type => (
          <div key={type} className={`${classes.join(' ')} ${props.role}`}>
            {type.toUpperCase().charAt(0)}
          </div>
        ))
      }
    </Aux>
  );
};

export default UserTypeIcon;
