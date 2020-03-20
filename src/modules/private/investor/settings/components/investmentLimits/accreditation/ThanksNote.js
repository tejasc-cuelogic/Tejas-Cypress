import React from 'react';
import { Header, Grid, Button } from 'semantic-ui-react';
import { NsModal } from '../../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

const ThanksNote = props => (
  <NsModal
    open
    onClose={props.closeModal}
    percent={100}
  >
    <Grid centered stackable className={isMobile ? 'full-width mt-0' : 'mt-0'}>
      <Grid.Column mobile={16} tablet={12} computer={8} className="pt-0">
        <Header as="h3">Thank you! Your request was received.</Header>
        <p>
          We are processing your request and we will notify you about status changes.
        </p>
        <Button onClick={() => props.handleExploreCampaigns()} fluid={isMobile} primary>Explore Campaigns</Button>
      </Grid.Column>
    </Grid>
  </NsModal>
);

export default ThanksNote;
