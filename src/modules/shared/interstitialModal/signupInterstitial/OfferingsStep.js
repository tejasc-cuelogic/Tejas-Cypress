import React from 'react';
import { Grid, Modal, Card, Header } from 'semantic-ui-react';
import HtmlEditor from '../../HtmlEditor';
import NSImage from '../../NSImage';

const isMobile = document.documentElement.clientWidth < 768;

const OfferingStepMeta = {
  header: 'Time to explore your investment opportunities!',
  content: <>Now that you know the basics of your NextSeed account, you can go ahead and <a href="/">complete your account setup</a>, or start exploring our current investment opportunities.</>,
  note: <><strong>Pro tip:</strong> Be sure to click the ‘Follow’ button on any campaign that interests you in order to receive regular campaign updates and alerts so that you never miss a chance to invest.</>,
};

const offeringsToDisplay = [
  {
    title: 'Bravery Chef Hall',
    location: 'Houston, TX',
    description: 'The next evolution of the food hall, Bravery Cheff Hall in Houston will feature five chef-driven concepts with an immersive dining experience and extensive beverage progam.',
    meta1: 'Raised $1,000,000 from 539 investors',
    meta2: 'Funded in May 2018',
    offeredBy: 'Offered by NextSeed Securities LLC',
    imageUrl: 'interstitial/bravery.png',
  }, {
    title: 'Citizen Pilates',
    location: 'Houston, TX',
    description: 'Boutique Reformer Pilates studio revered for its positive and inclusive envrionment',
    meta1: 'Raised $100,000 from 74 investors',
    meta2: 'Funded in October 2016',
    offeredBy: 'Offered by NextSeed Securities LLC',
    imageUrl: 'interstitial/citizen.png',
  }, {
    title: 'Buffbrew Taproom',
    location: 'Houston, TX',
    description: 'Houston brewery is expanding its facilities and launching the new Buffbrew Taproom, complete with a full-service kitchen, event space and over 40 beers on tap.',
    meta1: 'Raised $1,000,000 from 583 investors',
    meta2: 'Funded in March 2018',
    offeredBy: 'Offered by NextSeed Securities LLC',
    imageUrl: 'interstitial/buffbrew.png',
  },
];

const OfferingStep = () => (
  <Grid>
    <Grid.Column computer={6}>
      <Grid.Row>
        <Modal.Header>{OfferingStepMeta.header}</Modal.Header>
      </Grid.Row>
      <Grid.Row>
        <Modal.Content>{OfferingStepMeta.content}</Modal.Content>
      </Grid.Row>
    </Grid.Column>
    <Grid.Column computer={10}>
      <Card.Group itemsPerRow={isMobile ? 1 : 3}>
        {offeringsToDisplay.map(offering => (
          <Card className="bordered center-align">
            <NSImage path={offering.imageUrl} centered />
            <Card.Content>
              <Header as="h5">{offering.title}</Header>
              <Card.Meta>
                {offering.location}
              </Card.Meta>
              <Card.Description>
                <HtmlEditor readOnly content={offering.description} />
              </Card.Description>
              <p><b>{offering.meta1}</b></p>
              <p><b>{offering.meta2}</b></p>
              <p className="more-info">{offering.offeredBy}</p>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
      <p>{OfferingStepMeta.note}</p>
    </Grid.Column>
  </Grid>
);

export default OfferingStep;
