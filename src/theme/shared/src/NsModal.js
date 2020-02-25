import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Modal, Dimmer, Loader, Button } from 'semantic-ui-react';
import { ProgressModalHeader } from '..';
import Helper from '../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;

const NsModal = (props) => {
  const { iconName, closeOnDimmerClick, modalClassName,
    onClose, className, disableCloseIcon, headerLogo,
    isLoading, loaderMsg, actions, size, borderedHeader,
    modalContentClass, useMountNode, back, isProgressHeaderDisable } = props;
  const history = useHistory();
  const mountNode = Helper.customModalWrapper();
  return (
    <Modal
      size={size || 'large'}
      open
      mountNode={!useMountNode ? mountNode : false}
      closeOnDimmerClick={Boolean(closeOnDimmerClick)}
      closeOnRootNodeClick={Boolean(closeOnDimmerClick)}
      dimmer="inverted"
      onClose={
        () => {
          onClose();
        }
      }
      trigger={<Icon className={iconName || 'help circle'} color="green" />}
      className={`${modalClassName} ${isMobile && 'bg-white'} ${props.isLoading && 'dimmer-visible'} ${className} multistep-modal`}
      closeIcon={!disableCloseIcon}
      {...props}
      basic
      centered={false}
    >
      {<ProgressModalHeader Modal={Modal} handleClose={onClose} closeCta isProgressHeaderDisable={isProgressHeaderDisable} borderedHeader={borderedHeader} headerLogo={headerLogo} />}

      <Modal.Content className={modalContentClass || ''}>
        {
          back && !isMobile
          && (
            <Button
              icon={{ className: 'ns-chevron-left' }}
              className="prev link-button"
              onClick={() => (typeof back === 'string'
                ? history.push(back) : back())}
              content="Back"
            />
          )}
        {
          isLoading && (
            <Dimmer active={isLoading} className={isLoading ? 'fullscreen' : ''}>
              <Loader active={isLoading}>
                {loaderMsg || ''}
              </Loader>
            </Dimmer>
          )
        }
        {props.children}
      </Modal.Content>
      {
        actions
        && (
          <Modal.Actions className="signup-actions">
            {actions}
          </Modal.Actions>
        )
      }
    </Modal>
  );
};
export default NsModal;
