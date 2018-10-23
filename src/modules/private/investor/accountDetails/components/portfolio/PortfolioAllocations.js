import React from 'react';
import Aux from 'react-aux';
import { Header, Grid } from 'semantic-ui-react';
import ChartPie from './ChartPie';

// const INVESTMENT_TYPE = [
//   { name: 'Term Note', value: 7514 },
//   { name: 'Rev Share', value: 1299 },
// ];

// const INDUSTRY = [
//   { name: 'Food & Breverage', value: 3514 },
//   { name: 'Fitness', value: 1580 },
//   { name: 'Bar & Brewery', value: 7430 },
//   { name: 'Hospitality', value: 1299 },
//   { name: 'Other', value: 3200 },
// ];

const COLORS = ['#C782FF', '#28DAC9', '#0681A1', '#86D200', '#D2FF85', '#474747'];

const PortfolioAllocations = ({ pieChart }) => (
  <Aux>
    <Header as="h4">Portfolio Allocations</Header>
    <Grid celled="internally">
      <Grid.Row>
        <Grid.Column className="portfolio-allocation" widescreen={8} largeScreen={8} computer={16} mobile={16}>
          <ChartPie title="Investment Type" data={pieChart.investmentType} colors={COLORS} />
        </Grid.Column>
        <Grid.Column className="portfolio-allocation" widescreen={8} largeScreen={8} computer={16} mobile={16}>
          <ChartPie title="Industry" data={pieChart.industry} colors={COLORS} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Aux>
);

export default PortfolioAllocations;
