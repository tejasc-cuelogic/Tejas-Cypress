import React from 'react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../modules/shared/NSImage';

const imgMap = {
  LogoColor: 'logo-color.svg',
  LogoWhite: 'logo-white.svg',
  LogoWhiteGreen: 'logo-white-green.svg',
  LogoSmall: 'logo-icon.svg',
  LogoSmallWhite: 'logo-icon-white.svg',
  LogoLendio: 'lendio_logo.svg',
  LogoNsAndLendio: 'nextseed_and_lendio.svg',
  LogoNsAndLendioWhite: 'nextseed_and_lendio_white.svg',
  LogoBlack: 'logo_black.svg',
  LogoGreenGrey: 'logo.svg',
};

@inject('uiStore')
@observer
export default class Logo extends React.Component {
  showLoader = (refImg) => {
    if (['LogoLendio', 'LogoNsAndLendio', 'LogoNsAndLendioWhite'].includes(refImg)) {
      this.props.uiStore.setAppLoader(true);
      setTimeout(() => { this.props.uiStore.setAppLoader(false); }, 100);
    }
  };

  render() {
    return (
      <NSImage
        onClick={() => this.showLoader(this.props.dataSrc)}
        {...this.props}
        path={imgMap[this.props.dataSrc] || 'logo-color.svg'}
        className="logo"
      />
    );
  }
}
