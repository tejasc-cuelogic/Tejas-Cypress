/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const ConfirmModal = props => (
  <Modal open={props.open} onClose={props.handleCloseModal} size={isMobile ? 'fullscreen' : 'mini'} className={isMobile && 'full-screen-modal'}>
    <Modal.Content className={isMobile ? 'mt-60' : 'mt-30 center-align'}>
      <Header as="h3">Thank you for creating a NextSeed account</Header>
      <p className="mt-30 mb-30">
        {props.content}
      </p>
      <Divider hidden />
      <Button fluid={isMobile} onClick={props.HandleModalCta} primary size="large">Explore Campaigns</Button>
      <Divider hidden />
    </Modal.Content>
  </Modal>
);

export default ConfirmModal;
