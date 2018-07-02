import React from 'react';
import { Image } from 'semantic-ui-react';
import Identicon from 'identicon.js';

const optionsDefault = {
  foreground: [132, 176, 43, 1], background: [255, 255, 255, 255], margin: 0.2, size: 420, format: 'png',
};

const UserTypeColor = {
  ADMIN: [0, 0, 0, 255],
  BUSINESS: [39, 174, 96],
  IRA: [39, 174, 96],
  INDIVIDUAL: [39, 174, 96],
  ENTITY: [242, 153, 74],
};

const randavatar = (props) => {
  const options = {
    ...optionsDefault,
    ...{ foreground: UserTypeColor[props.accountType[0].toUpperCase()] },
  };
  const imgContent = (!props.avatarUrl && props.avatarKey.length > 15) ?
    `data:image/png;base64, ${new Identicon(props.avatarKey, options).toString()}` : props.avatarUrl;
  const alt = (props.name) ? props.name[0] : 'N';
  const size = props.size || 'huge';
  return (
    <Image
      src={`${imgContent}`}
      alt={alt}
      size={size}
      avatar
      circular
    />);
};

export default randavatar;
