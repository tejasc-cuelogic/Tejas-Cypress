import React from 'react';
import Aux from 'react-aux';
import { Header, Grid } from 'semantic-ui-react';
import ChartPie from './ChartPie';

const COLORS = ['#C782FF', '#28DAC9', '#0681A1', '#86D200', '#D2FF85', '#474747'];

const PortfolioAllocations = ({ pieChart }) => (
  <Aux>
    <Header as="h4">Portfolio Allocations</Header>
    <Grid celled="internally">
      <Grid.Row>
        <Grid.Column className="portfolio-allocation" widescreen={5} largeScreen={5} computer={8} tablet={16} mobile={16}>
          <ChartPie title="Investment Type" data={pieChart.investmentType} colors={COLORS} />
        </Grid.Column>
        <Grid.Column className="portfolio-allocation" widescreen={6} largeScreen={6} computer={8} tablet={16} mobile={16}>
          <ChartPie title="Industry" data={pieChart.industry} colors={COLORS} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Aux>
);

export default PortfolioAllocations;
