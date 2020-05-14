import React from 'react';
import { Grid, Modal } from 'semantic-ui-react';
import NSImage from '../../NSImage';

const isMobile = document.documentElement.clientWidth < 768;

const porfolioStepMeta = {
  header: 'Let’s have a look around your new account',
  content: <>Once you’ve made your first investment on NextSeed, this is where you’ll find information related to your investment portfolio — including payments, updates, returns and more.<br /><br />Also, check your Profile Settings to keep your investment limits and Accredited Investor status up to date.</>,
  imageUrl: `${!isMobile ? 'interstitial/portfolio.png' : 'interstitial/portfolioMobile.png'}`,
};

const PortfolioStep = () => (
  <Grid>
    <Grid.Column computer={6}>
      <Grid.Row>
        <Modal.Header>{porfolioStepMeta.header}</Modal.Header>
      </Grid.Row>
      <Grid.Row>
      <Modal.Content>{porfolioStepMeta.content}</Modal.Content>
      </Grid.Row>
    </Grid.Column>
    <Grid.Column computer={10}>
      <NSImage path={porfolioStepMeta.imageUrl} fluid />
    </Grid.Column>
  </Grid>
);

export default PortfolioStep;
