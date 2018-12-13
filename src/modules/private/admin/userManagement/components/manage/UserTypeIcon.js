import React from 'react';
import Aux from 'react-aux';

const accChars = {
  issuer: 'B',
  INDIVIDUAL: 'I',
  IRA: 'R',
  ENTITY: 'E',
  admin: 'A',
  investor: 'I',
};
const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  if (props.accreditation === 'yes') {
    classes.push('accredited');
    console.log('props', props);
  }
  const byRoles = props.role.map((r) => {
    console.log(r);
    if (r.name === 'investor') {
      if (props.role.find(obj => obj.name === 'INDIVIDUAL')) {
        return null;
      }
    }
    return (
      <div key={r.name} className={`${classes.join(' ')} ${r.name}`}>
        {accChars[r.name]}
      </div>
    );
  });
  return (
    <Aux>
      {byRoles}
    </Aux>
  );
};

export default UserTypeIcon;
