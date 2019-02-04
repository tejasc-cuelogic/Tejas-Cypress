import React from 'react';
import { observer } from 'mobx-react';
import { Image } from 'semantic-ui-react';
import Avatar from 'react-avatar';
import { Image64 } from '../../../theme/shared';
import { ASSETS_URL } from '../../../constants/aws';

const userRoles = {
  admin: 'admin', issuer: 'issuer', bowner: 'issuer', investor: 'investor', default: 'investor',
};

const UserAvatar = observer((props) => {
  const { UserInfo, size, base64url } = props;
  const isBase64ImgTag = !!(UserInfo.avatarUrl || (UserInfo.firstName !== '' && UserInfo.lastName !== '') || UserInfo.name);
  const imgSize = size || 'tiny';
  const avatarName = (UserInfo.firstName && UserInfo.lastName) ? `${UserInfo.name} ${UserInfo.lastName}` : UserInfo.firstName ? UserInfo.firstName : '';
  const avatarProfile = UserInfo.avatarUrl || (UserInfo.firstName && UserInfo.lastName) || UserInfo.name ? UserInfo.avatarUrl : `${ASSETS_URL}images/leader-placeholder.jpg`;
  if (avatarProfile) {
    return (
      base64url && isBase64ImgTag ?
        <Image64
          srcUrl={avatarProfile}
          alt={UserInfo.firstName}
          size={imgSize}
          avatar
          circular
        />
        :
        <Image
          src={avatarProfile}
          alt={UserInfo.firstName}
          size={imgSize}
          avatar
          circular
        />
    );
  }
  return (
    <Avatar
      name={avatarName}
      round
      unstyled
      size={imgSize}
      className={`${(UserInfo.roles && UserInfo.roles.length) ? userRoles[UserInfo.roles[0]] : userRoles.default} ${props.className}`}
    />
  );
});

export default UserAvatar;
