import React from 'react';
import { Progress } from 'semantic-ui-react';
import Logo from './Logo';

const ProgressModalHeader = ({ Modal, name, percent }) => (
  <Modal.Header className="text-uppercase">
    <div className="multistep-header">
      <Logo dataSrc="LogoGreenGrey" size="small" />
      {(
        <>
        {name && <span className="vertical-divider">|</span>}
          <span className="display-block ml-16">{name || ''}</span>
        </>
      )}
    </div>
    <Progress percent={percent} attached="bottom" color="green" />
  </Modal.Header>
);

export default ProgressModalHeader;
