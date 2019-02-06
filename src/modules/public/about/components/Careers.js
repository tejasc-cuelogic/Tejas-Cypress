import React from 'react';
import Aux from 'react-aux';
import { Header, Container, Grid, Button, Responsive } from 'semantic-ui-react';
import NSImage from '../../../shared/NSImage';

const isMobile = document.documentElement.clientWidth < 768;
const Careers = () => (
  <Aux>
    <section>
      <Container>
        <Grid centered>
          <Grid.Column textAlign={isMobile ? 'left' : 'center'} computer={12} tablet={12} mobile={16}>
            <Header as="h2">
              Democratize finance. Create change.<Responsive minWidth={992} as="br" />
              Join our team.
            </Header>
            <p className="mt-30">
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
            <NSImage path="collage.jpg" className="careers-banner" />
          </Grid.Column>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Careers;
