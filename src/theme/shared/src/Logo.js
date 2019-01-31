import React from 'react';
import NSImage from '../../../modules/shared/NSImage';

const getSrc = (src) => {
  console.log(src);
  switch (src) {
    case 'LogoColor':
      return 'logo-color.svg';
    case 'LogoWhite':
      return 'logo-white.svg';
    case 'LogoWhiteGreen':
      return 'logo-white-green.svg';
    case 'LogoSmall':
      return 'logo-icon.svg';
    case 'LogoSmallWhite':
      return 'logo-icon-white.svg';
    case 'LogoLendio':
      return 'lendio_logo.svg';
    case 'LogoNsAndLendio':
      return 'nextseed_and_lendio.svg';
    default:
      return 'logo-color.svg';
  }
};

const Logo = props => <NSImage {...props} path={getSrc(props)} className="logo" />;

export default Logo;
