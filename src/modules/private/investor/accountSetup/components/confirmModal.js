/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Modal, Header, Divider, Button, Grid } from 'semantic-ui-react';

const isMobile = document.documentElement.clientWidth < 768;
const ConfirmModal = props => (
  <Modal dimmer={!isMobile && 'inverted'} open={props.open} onClose={props.handleCloseModal} size="fullscreen" className={isMobile && 'full-screen-modal'}>
    <Modal.Content className={isMobile ? 'mt-60' : 'mt-30'}>
      <Grid centered textAlign="left">
        <Grid.Column width={isMobile ? '16' : '4'}>
          <Header as="h4">Thank you for creating a NextSeed account</Header>
          <p className="mt-30 mb-30">
            {props.content}
          </p>
          <Divider hidden />
          <Button fluid={isMobile} onClick={props.HandleModalCta} primary size="large">Explore Campaigns</Button>
          <Divider hidden />
        </Grid.Column>
      </Grid>
    </Modal.Content>
  </Modal>
);

export default ConfirmModal;
