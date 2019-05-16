import React, { Component } from 'react';
import { observer } from 'mobx-react';
// import { Image } from 'semantic-ui-react';
import Avatar from 'react-avatar';
import { Image64 } from '../../../theme/shared';
import NSImage from '../../../modules/shared/NSImage';

const userRoles = {
  admin: 'admin', issuer: 'issuer', bowner: 'issuer', investor: 'investor', default: 'investor',
};
@observer
class UserAvatar extends Component {
  render() {
    const {
      UserInfo, size,
      // base64url,
    } = this.props;
    // const isBase64ImgTag = !!(UserInfo.avatarUrl ||
    // (UserInfo.firstName !== '' && UserInfo.lastName !== '') || UserInfo.name);
    const imgSize = size || 'tiny';
    const fullName = UserInfo.name && UserInfo.name.split(' ');
    const avatarName = (UserInfo.firstName && UserInfo.lastName) ? `${UserInfo.firstName[0]} ${UserInfo.lastName[0]}` : UserInfo.name && fullName.length > 0 ? (fullName.length === 1 ? fullName[0] : `${fullName[0]} ${fullName[fullName.length - 1]}`) : '';
    const avatarProfile = UserInfo.avatarUrl || (UserInfo.firstName && UserInfo.lastName) || UserInfo.name ? UserInfo.avatarUrl : 'leader-placeholder.jpg';
    if (avatarProfile) {
      return (
        avatarProfile === 'leader-placeholder.jpg' ?
          <NSImage path={avatarProfile} size={imgSize} avatar circular /> :
          <Image64
            srcUrl={avatarProfile}
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
        className={`${(UserInfo.roles && UserInfo.roles.length) ? userRoles[UserInfo.roles[0]] : userRoles.default} ${this.props.className}`}
      />
    );
  }
}

export default UserAvatar;
