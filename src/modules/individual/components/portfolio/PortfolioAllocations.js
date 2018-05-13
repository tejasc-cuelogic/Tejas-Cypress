import React from 'react';
import Aux from 'react-aux';
import { Header, Grid } from 'semantic-ui-react';
import ChartPie from './ChartPie';

const INVESTMENT_TYPE = [
  { name: 'Term Note', value: 7514 },
  { name: 'Rev Share', value: 1299 },
];

const INDUSTRY = [
  { name: 'Food & Breverage', value: 3514 },
  { name: 'Fitness', value: 1580 },
  { name: 'Bar & Brewery', value: 7430 },
  { name: 'Hospitality', value: 1299 },
  { name: 'Other', value: 3200 },
];

const REGION = [
  { name: 'North East', value: 7514 },
  { name: 'South East', value: 1299 },
  { name: 'Midwest', value: 5399 },
  { name: 'South Central', value: 1100 },
  { name: 'Mountain', value: 532 },
  { name: 'West', value: 1730 },
];

const COLORS = ['#C782FF', '#28DAC9', '#0681A1', '#86D200', '#D2FF85'];

const PortfolioAllocations = () => (
  <Aux>
    <Header as="h3">Portfolio Allocations</Header>
    <Grid columns="equal" celled="internally">
      <Grid.Column style={{ paddingLeft: '0px' }}>
        <ChartPie title="Investment Type" data={INVESTMENT_TYPE} colors={COLORS} />
      </Grid.Column>
      <Grid.Column style={{ paddingLeft: '0px' }}>
        <ChartPie title="Industry" data={INDUSTRY} colors={COLORS} />
      </Grid.Column>
      <Grid.Column style={{ paddingLeft: '0px' }}>
        <ChartPie title="Boston 25%" data={REGION} colors={COLORS} />
      </Grid.Column>
    </Grid>
  </Aux>
);

export default PortfolioAllocations;
