import React from 'react';
import { Grid, Modal } from 'semantic-ui-react';
import NSImage from '../../NSImage';

const isMobile = document.documentElement.clientWidth < 768;

const accountStepMeta = {
  header: 'Flexible account options, rigid security',
  content: <>When you invest on NextSeed, you will do so with an FDIC-insured investment account set up with our partner bank, Goldstar Trust.<br /><br />After we verify your identity using bank-level security measures, you will be asked to create one of three types of accounts based on your preference.</>,
  imageUrl: `${isMobile ? 'interstitial/accounts.png' : 'interstitial/accountsMobile.png'}`,
};

const AccountStep = () => (
  <Grid>
    <Grid.Column computer={6}>
      <Grid.Row>
        <Modal.Header>{accountStepMeta.header}</Modal.Header>
      </Grid.Row>
      <Grid.Row>
      <Modal.Content>{accountStepMeta.content}</Modal.Content>
      </Grid.Row>
    </Grid.Column>
    <Grid.Column computer={10}>
      <NSImage path={accountStepMeta.imageUrl} fluid />
    </Grid.Column>
  </Grid>
);

export default AccountStep;
