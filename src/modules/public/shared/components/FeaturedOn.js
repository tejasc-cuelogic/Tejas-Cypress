/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import { Header, Container, Grid, Image } from 'semantic-ui-react';

const featuredOn = [
  ['bloomberg', 'houston-chronicle', 'forbes', 'ny-times', 'aas', 'w-journal', 'npr'],
  ['time', 'msn-money', 'crowdfund-insider', 'pc', 'mashable', 'us-news'],
];

const FeaturedOn = () => (
  <section className="featured-section">
    <Container>
      <Header as="h2" textAlign="center" className="mb-50">As seen on…</Header>
      <Grid columns="equal" doubling stackable>
        {featuredOn.map(row => (
          <Grid.Row>
            {row.map(f => (
              <Grid.Column>
                <Image centered src={require(`../../../../assets/images/featured/${f}.png`)} />
              </Grid.Column>
            ))}
          </Grid.Row>
        ))}
      </Grid>
    </Container>
  </section>
);

export default FeaturedOn;
