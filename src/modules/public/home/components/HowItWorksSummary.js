import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Grid } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const HowItWorksSummary = props => (
  <section>
    <Container textAlign={props.isMobile ? 'left' : 'center'}>
      <Header as="h2" className="mb-30">A new way to invest in local businesses.</Header>
      <p className="mb-80">
        Local entrepreneurs and investors are reshaping the face of Main Street.
        NextSeed offers the opportunity <br /> to invest in restaurants, fitness studios,
        craft breweries and a variety of growing concepts.
      </p>
    </Container>
    <Container>
      <Grid centered relaxed="very">
        <Grid.Column textAlign="center" computer={6} tablet={6} mobile={16} className={`info-card home-summary ${props.isMobile && 'mb-50'}`}>
          <NSImage path="icons/bizowner.svg" centered />
          <Header as="h5">Business Owners</Header>
          <p>
            Raise capital to expand or open a new concept.
            We make it easy to accept investments from friends and fans,
            and put your story in front of thousands of local investors.
          </p>
          <Button as={Link} to="/business/how-it-works" primary content="SMB Fundraising" className="mt-20" />
        </Grid.Column>
        <Grid.Column textAlign="center" computer={6} tablet={6} mobile={16} className="info-card home-summary">
          <NSImage path="icons/investors.svg" centered />
          <Header as="h5">Investors</Header>
          <p>
            Access unique, pre-vetted investment opportunities.
            Put your money to work in businesses you understand and
            projects that create jobs.
          </p>
          <Button as={Link} to="/invest/why-nextseed" primary content="Investing" className="mt-20" />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default HowItWorksSummary;
