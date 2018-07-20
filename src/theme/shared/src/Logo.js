import React from 'react';
import { Image } from 'semantic-ui-react';
import LogoColor from '../../../assets/images/logo-color.svg';
import LogoWhite from '../../../assets/images/logo-white.svg';
import LogoWhiteGreen from '../../../assets/images/logo-white-green.svg';
import LogoSmall from '../../../assets/images/logo-icon.svg';
import LogoSmallWhite from '../../../assets/images/logo-icon-white.svg';
import LogoLendio from '../../../assets/images/lendio_logo.svg';
import LogoNsAndLendio from '../../../assets/images/nextseed_and_lendio.svg';

const getSrc = (src) => {
  switch (src) {
    case 'LogoColor':
      return LogoColor;
    case 'LogoWhite':
      return LogoWhite;
    case 'LogoWhiteGreen':
      return LogoWhiteGreen;
    case 'LogoSmall':
      return LogoSmall;
    case 'LogoSmallWhite':
      return LogoSmallWhite;
    case 'LogoLendio':
      return LogoLendio;
    case 'LogoNsAndLendio':
      return LogoNsAndLendio;
    default:
      return LogoColor;
  }
};

const Logo = props => <Image {...props} src={getSrc(props.dataSrc)} className="logo" />;

export default Logo;
