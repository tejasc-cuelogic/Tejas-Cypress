import React from 'react';
import Aux from 'react-aux';

const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  if (props.accreditation === 'yes') {
    classes.push('accredited');
    console.log('props', props);
  }
  const byRoles = props.role.map(r => (
    <div key={r.scope} className={`${classes.join(' ')} ${r.scope}`}>
      {r.scope === 'issuer' ? 'B' : r.scope.toUpperCase().charAt(0)}
    </div>
  ));
  return (
    <Aux>
      {byRoles}
    </Aux>
  );
};

export default UserTypeIcon;
