import React from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';
import ChartPie from './ChartPie';

const isTablet = document.documentElement.clientWidth < 992;
const COLORS = ['#C782FF', '#28DAC9', '#4287f5', '#8742f5', '#cc8718', '#0681A1', '#86D200', '#474747', '#140c87', '#f5426c'];

const PortfolioAllocations = ({ pieChart, isAdmin }) => (
  <>
    <Header as={isTablet ? 'h5' : 'h4'}>Portfolio Allocations</Header>
    <Grid celled={isTablet ? undefined : 'internally'}>
      <Grid.Row>
        <Grid.Column className="portfolio-allocation" widescreen={isAdmin ? 7 : 6} largeScreen={7} computer={7} tablet={12} mobile={12}>
          <ChartPie title="Investment Type" data={pieChart.investmentType} colors={COLORS} />
        </Grid.Column>
        <Grid.Column className="portfolio-allocation industry-chart" widescreen={isAdmin ? 9 : 6} largeScreen={9} computer={9} tablet={16} mobile={16}>
          <ChartPie icons={INDUSTRY_TYPES_ICONS} title="Industry" data={pieChart.industry} colors={COLORS} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>
);

export default PortfolioAllocations;
