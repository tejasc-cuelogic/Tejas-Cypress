import React from 'react';
import { Image } from 'semantic-ui-react';
import Identicon from 'identicon.js';

const randavatar = (props) => {
  const imgContent = (props.avatarKey && props.avatarKey.length > 15) ?
    new Identicon(props.avatarKey, 420).toString() : '';
  const alt = (props.name) ? props.name[0] : 'N';
  const size = props.size || 'mini';
  return (
    <Image
      src={`data:image/png;base64, ${imgContent}`}
      alt={alt}
      size={size}
      avatar
      circular
    />);
};

export default randavatar;
