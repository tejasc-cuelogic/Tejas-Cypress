import React from 'react';
import { Image } from 'semantic-ui-react';
import LogoWhite from '../../../assets/images/nextseed_logo_white_green.svg';
import LogoColor from '../../../assets/images/nextseed_logo_color.svg';
import LogoSmall from '../../../assets/images/ns-logo-small.svg';
import LogoLendio from '../../../assets/images/lendio_logo.svg';
import LogoNsAndLendio from '../../../assets/images/nextseed_and_lendio.svg';

const getSrc = (src) => {
  switch (src) {
    case 'LogoWhite':
      return LogoWhite;
    case 'LogoColor':
      return LogoColor;
    case 'LogoSmall':
      return LogoSmall;
    case 'LogoLendio':
      return LogoLendio;
    case 'LogoNsAndLendio':
      return LogoNsAndLendio;
    default:
      return LogoWhite;
  }
};

const Logo = props => <Image {...props} src={getSrc(props.dataSrc)} className="logo" />;

export default Logo;
