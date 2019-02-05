import React from 'react';
import { Image } from 'semantic-ui-react';
import { ASSETS_URL } from '../../../constants/aws';

const getSrc = (src) => {
  switch (src) {
    case 'LogoColor':
      return `${ASSETS_URL}images/logo-color.svg`;
    case 'LogoWhite':
      return `${ASSETS_URL}images/logo-white.svg`;
    case 'LogoWhiteGreen':
      return `${ASSETS_URL}images/logo-white-green.svg`;
    case 'LogoSmall':
      return `${ASSETS_URL}images/logo-icon.svg`;
    case 'LogoSmallWhite':
      return `${ASSETS_URL}images/logo-icon-white.svg`;
    case 'LogoLendio':
      return `${ASSETS_URL}images/lendio_logo.svg`;
    case 'LogoNsAndLendio':
      return `${ASSETS_URL}images/nextseed_and_lendio.svg`;
    case 'LogoGreenGrey':
      return `${ASSETS_URL}images/logo.png`;
    default:
      return `${ASSETS_URL}images/logo-color.svg`;
  }
};

const Logo = props => <Image {...props} src={getSrc(props.dataSrc)} className="logo" />;

export default Logo;
