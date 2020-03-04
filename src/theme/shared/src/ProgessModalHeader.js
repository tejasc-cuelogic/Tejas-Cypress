import React from 'react';
import { Progress, Button } from 'semantic-ui-react';
import Logo from './Logo';

const isMobile = document.documentElement.clientWidth < 768;

const ProgressModalHeader = ({ Modal, name, percent, handleClose, closeCta, isProgressHeaderDisable, borderedHeader, headerLogo }) => (
  <Modal.Header className={`${borderedHeader ? 'bordered padded' : ''} text-uppercase plr-0`}>
    {isMobile && headerLogo
      && <Logo dataSrc="LogoGreenGrey" size="small" />}
    {((closeCta && isMobile) && (
      <Button
        icon={{ className: 'ns-close-light' }}
        className="link-button pull-right"
        onClick={handleClose}
      />
    ))
    }
    {
      !isMobile ? (
        <div className="multistep-header">
          <Logo dataSrc="LogoGreenGrey" size="small" />
          {(
            <>
              {name && <span className="vertical-divider">|</span>}
              <span className="display-block ml-16">{name || ''}</span>
            </>
          )}
        </div>
      )
        : name || ''
    }
    {!isProgressHeaderDisable && <Progress className={name ? '' : 'no-header'} percent={percent} attached="bottom" color="green" />}
  </Modal.Header>
);

export default ProgressModalHeader;
