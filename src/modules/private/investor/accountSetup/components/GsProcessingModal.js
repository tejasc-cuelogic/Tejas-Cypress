/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Header, Divider, Button } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const GsProcessingModal = props => (
  <Modal open={props.open} size="mini">
    <Modal.Content className={`${isMobile ? '' : 'center-align'} mt-30`}>
      <Header as="h4">Thank you for creating an account with NextSeed</Header>
      <p className="mt-30 mb-30">
        While we set up your account, check out some of the investment opportunities
        now available to you as a member of the NextSeed community.
      </p>
      <Divider hidden />
      <Button fluid={isMobile} onClick={props.closeModal} primary size="large">Explore Campaigns</Button>
      <Divider hidden />
    </Modal.Content>
  </Modal>
);

export default GsProcessingModal;
