import React from 'react';
import Aux from 'react-aux';
import { toLower } from 'lodash';

const accChars = {
  issuer: 'B',
  individual: 'I',
  ira: 'R',
  entity: 'E',
  admin: 'A',
  investor: 'P',
};
const UserTypeIcon = (props) => {
  const classes = ['account-type', 'small'];
  if (props.accreditation === 'yes') {
    classes.push('accredited');
  }
  const byRoles = props.role.map((r) => {
    if (r.name === 'investor' && props.role.length > 1) {
      // if (props.role.find(obj => toLower(obj.name) === 'individual')) {
      return null;
      // }
    }
    return (
      <div key={r.name} className={`${classes.join(' ')} ${r.name}`}>
        {accChars[toLower(r.name)]}
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
