import React from 'react';
import { useHistory } from 'react-router-dom';
import { Icon, Modal, Dimmer, Loader, Button } from 'semantic-ui-react';
import { ProgressModalHeader } from '..';
import Helper from '../../../helper/utility';

const isMobile = document.documentElement.clientWidth < 768;

const NsModal = (props) => {
  const { iconName, closeOnDimmerClick,
    onClose, className, disableCloseIcon,
    isLoading, loaderMsg, actions, size,
    modalContentClass, useMountNode, backUrl } = props;
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
      className={`${isMobile && 'bg-white'} ${props.isLoading && 'dimmer-visible'} ${className} multistep-modal`}
      closeIcon={!disableCloseIcon}
      {...props}
      basic
    >
      {<ProgressModalHeader Modal={Modal} handleClose={onClose} closeCta />}

      <Modal.Content className={modalContentClass || 'multistep'}>
        {
          backUrl
          && (
            <Button
              icon={{ className: 'ns-chevron-left' }}
              className="prev link-button"
              onClick={() => history.push(backUrl)}
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
        {/* {
          <Header as="h3" className="mb-0">
            {header}
          </Header>
        }
        {headerSiblings} */}
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
