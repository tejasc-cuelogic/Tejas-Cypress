import React from 'react';
import { Icon, Modal, Popup } from 'semantic-ui-react';

const PopUpModal = (props) => {
  const { label, content, iconName, showOnlyPopup, customTrigger } = props;
  return (showOnlyPopup
    ? (
      <Popup
        trigger={customTrigger || <Icon className="ns-help-circle" />}
        content={content}
        position="top center"
        wide
        hoverable
        color="grey"
      />
    ) : (
      <Modal size="tiny" className="mobile-tooltip" trigger={customTrigger || <Icon className={iconName || 'help circle'} color="green" />} closeIcon>
        <Modal.Content>
          {label ? <h5>{label}</h5> : null}
          {content ? <span>{content}</span> : null}
        </Modal.Content>
      </Modal>
    )
  );
};

export default PopUpModal;
