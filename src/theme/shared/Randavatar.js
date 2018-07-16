import React from 'react';
import { observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import Avatar from 'react-avatar';

const userColors = {
  admin: '000000', bowner: '27AE60', investor: 'F2994A', default: '7eab1d',
};

const randavatar = observer((props) => {
  const { UserInfo, size } = props;
  if (UserInfo.avatarUrl) {
    return (
      <Image
        src={UserInfo.avatarUrl}
        alt={UserInfo.firstName}
        size={size || 'huge'}
        avatar
        circular
      />);
  }

  return (
    <Avatar
      name={`${UserInfo.firstName} ${UserInfo.lastName}`}
      round
      color={`#${userColors[UserInfo.roles[0]] || userColors.default}`}
      size={size === 'mini' ? '35' : 58}
    />
  );
});

export default randavatar;
