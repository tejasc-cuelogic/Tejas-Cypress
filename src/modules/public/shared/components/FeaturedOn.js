/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import { Header, Container, Grid, Image, Responsive } from 'semantic-ui-react';
import Aux from 'react-aux';

const featuredOn = [
  ['bloomberg', 'houston-chronicle', 'forbes', 'ny-times', 'aas', 'w-journal', 'npr'],
  ['time', 'msn-money', 'crowdfund-insider', 'pc', 'mashable', 'us-news'],
];

const FeaturedOn = () => (
  <section className="featured-section">
    <Container>
      <Header as="h2" textAlign="center" className="mb-50">As seen on…</Header>
      <Grid columns="equal" doubling stackable>
        <Responsive minWidth="768" as={Aux}>
          {featuredOn.map(row => (
            <Grid.Row>
              {row.map(f => (
                <Grid.Column>
                  <Image centered src={require(`../../../../assets/images/featured/${f}.png`)} />
                </Grid.Column>
              ))}
            </Grid.Row>
          ))}
        </Responsive>
        <Responsive maxWidth="767" as={Aux}>
          {featuredOn.map(row => row.map(f => (
            <Grid.Column>
              <Image centered src={require(`../../../../assets/images/featured/${f}.png`)} />
            </Grid.Column>
          )))}
        </Responsive>
      </Grid>
    </Container>
  </section>
);

export default FeaturedOn;
