/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import { Header, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';

const featuredOn = [
  ['bloomberg', 'forbes', 'ny-times', 'w-journal', 'npr', 'time', 'msn-money', 'crowdfund-insider', 'mashable', 'us-news'],
];

const FeaturedOn = () => (
  <section className="bg-offwhite">
    <Container>
      <Header as="h3" textAlign="center" className="mb-50 grey-header">As seen on</Header>
      <Grid columns={5} doubling verticalAlign="middle" className="vertical-gutter">
        <Responsive minWidth="768" as={Aux}>
          {/* {featuredOn.map(row => (
            <Grid.Row> */}
          {featuredOn.map(row => row.map(f => (
            <Grid.Column>
              <Image centered src={require(`../../../../assets/images/featured/${f}.png`)} />
            </Grid.Column>
          )))}
          {/* </Grid.Row>
          ))} */}
        </Responsive>
        <Responsive maxWidth="767" as={Aux}>
          {featuredOn.map(row => row.map(f => (
            <Grid.Column className="featured-logos">
              <Image centered src={require(`../../../../assets/images/featured/${f}.png`)} />
            </Grid.Column>
          )))}
        </Responsive>
      </Grid>
    </Container>
  </section>
);

export default FeaturedOn;
