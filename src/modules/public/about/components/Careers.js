import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Button, Image, Responsive } from 'semantic-ui-react';
import collage from '../../../../assets/images/collage.jpg';

const isMobile = document.documentElement.clientWidth < 768;
const Careers = () => (
  <Aux>
    <section>
      <Container>
        <Grid centered>
          <Grid.Column computer={12} tablet={12} mobile={16}>
            <Responsive as={Image} src={collage} maxWidth={767} />
            <Header as="h2" textAlign={isMobile ? 'left' : 'center'}>
            Democratize finance. Create change.<br /> Join our team.
            </Header>
            <p className={isMobile ? 'mt-30' : 'center-align mt-30'}>
            We’re just getting started in our journey to shape the future of finance in
            local communities. We’re looking for talented and motivated individuals who
            are seeking an adventure to learn new skills and cover new ground. If you are
            a self-starter and love working in a dynamic environment, NextSeed may be
            the place for you.
            </p>
            <div className="center-align mt-30 mb-50">
              <Button
                onClick={() => window.open('https://nextseed.workable.com/', '_blank')}
                primary
              >
              See Job Listings
              </Button>
            </div>
            <Responsive as={Image} src={collage} minWidth={768} />
          </Grid.Column>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Careers;
