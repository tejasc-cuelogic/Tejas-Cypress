/* eslint-disable import/no-dynamic-require, global-require */
import React from 'react';
import { Header, Container, Grid, Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import NSImage from '../../../shared/NSImage';

const featuredOn = [
  ['bloomberg', 'forbes', 'ny-times', 'w-journal', 'npr', 'time', 'msn-money', 'crowdfund-insider', 'mashable', 'us-news'],
];

const FeaturedOn = ({ uiStore }) => (
  <section className="bg-offwhite">
    <Container className={uiStore.responsiveVars.isMobile ? 'mb-20 mt-20' : 'mt-50 mb-50'}>
      <Header as={uiStore.responsiveVars.isMobile ? 'h2' : 'h3'} textAlign="center" className="mb-50 grey-header">As seen on</Header>
      <Grid relaxed={uiStore.responsiveVars.isMobile && 'very'} columns={5} doubling verticalAlign="middle" className={uiStore.responsiveVars.isMobile ? '' : 'vertical-gutter'}>
        <Responsive minWidth="768" as={React.Fragment}>
          {/* {featuredOn.map(row => (
            <Grid.Row> */}
          {featuredOn.map(row => row.map(f => (
            <Grid.Column key={f}>
              <NSImage centered path={`featured/${f}.png`} />
            </Grid.Column>
          )))}
          {/* </Grid.Row>
          ))} */}
        </Responsive>
        <Responsive maxWidth="767" as={React.Fragment}>
          {featuredOn.map(row => row.map(f => (
            <Grid.Column className="featured-logos" key={f}>
              <NSImage centered path={`featured/${f}.png`} />
            </Grid.Column>
          )))}
        </Responsive>
      </Grid>
    </Container>
  </section>
);
export default inject('uiStore')(observer(FeaturedOn));
