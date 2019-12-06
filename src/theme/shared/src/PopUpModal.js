import React from 'react';
import { Icon, Modal } from 'semantic-ui-react';

const PopUpModal = (props) => {
  const { label, content, iconName } = props;
  return (
        <Modal size="tiny" className="mobile-tooltip" trigger={<Icon className={iconName || 'help circle'} color="green" />} closeIcon>
        <Modal.Content>
        <h5>
          {label}
        </h5>
        <span>{content}</span>
        </Modal.Content>
      </Modal>
  );
};

export default PopUpModal;
