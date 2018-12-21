import React from 'react';
import { observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import Avatar from 'react-avatar';

const userRoles = {
  admin: 'admin', issuer: 'issuer', bowner: 'issuer', investor: 'investor', default: 'investor',
};

const UserAvatar = observer((props) => {
  const { UserInfo, size } = props;
  if (UserInfo.avatarUrl) {
    return (
      <Image
        src={UserInfo.avatarUrl}
        alt={UserInfo.firstName}
        size={size}
        avatar
        circular
      />);
  }

  return (
    <Avatar
      name={`${UserInfo.firstName} ${UserInfo.lastName}`}
      round
      unstyled
      className={`${userRoles[UserInfo.roles[0]] || userRoles.default}`}
    />
  );
});

export default UserAvatar;
