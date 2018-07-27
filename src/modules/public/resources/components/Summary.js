import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Container, Button, Grid, Image } from 'semantic-ui-react';
import UserOne from '../../../../assets/images/owner-1.jpg';
import UserTwo from '../../../../assets/images/owner-2.jpg';

const Summary = props => (
  <section>
    <Container text textAlign="center">
      <Header as="h2" className="mb-30">Education Center</Header>
      <p className="mb-80">
        A resource for investors and entrepreneurs to understand how NextSeed works and
        how best to leverage this new way of fundraising and investing.
      </p>
    </Container>
    <Container>
      <Grid centered relaxed="very" stackable>
        <Grid.Column textAlign="center" width={6} className="info-card">
          <Image src={UserOne} size="small" circular centered />
          <p>
            Understand how to add local businesses to your investment portfolio,
            how NextSeed investments work, and the risks and opportunities offered by
            this new way of investing.
          </p>
          <Button as={Link} to={`${props.refUrl}/investor`} primary content="For Investors" />
        </Grid.Column>
        <Grid.Column textAlign="center" width={6} className="info-card">
          <Image src={UserTwo} size="small" circular centered />
          <p>
            Learn about the business implications of different types of fundraising,
            how to add NextSeed to your capital stack and how to get started.
          </p>
          <Button as={Link} to={`${props.refUrl}/business`} primary content="For Businesses" />
        </Grid.Column>
      </Grid>
    </Container>
  </section>
);

export default Summary;
