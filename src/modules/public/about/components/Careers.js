import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Container, Grid, Button, Image } from 'semantic-ui-react';
import collage from '../../../../assets/images/collage.jpg';

const Careers = () => (
  <Aux>
    <section>
      <Container>
        <Grid centered>
          <Grid.Column width={12}>
            <Header as="h2" textAlign="center">
            Democratize finance. Create change.<br /> Join our team.
            </Header>
            <p className="center-align mt-30">
            We’re just getting started in our journey to shape the future of finance in
            local communities. We’re looking for talented and motivated individuals who
            are seeking an adventure to learn new skills and cover new ground. If you are
            a self-starter and love working in a dynamic environment, NextSeed may be
            the place for you.
            </p>
            <div className="center-align mt-30 mb-50">
              <Link as={Button} to="https://nextseed.workable.com/" target="_blank" className="ui button primary">
              See Job Listings
              </Link>
            </div>
            <Image src={collage} />
          </Grid.Column>
        </Grid>
      </Container>
    </section>
  </Aux>
);

export default Careers;
