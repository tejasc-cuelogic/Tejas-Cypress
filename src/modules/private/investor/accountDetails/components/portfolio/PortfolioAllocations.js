import React from 'react';
import { Header, Grid } from 'semantic-ui-react';
import { INDUSTRY_TYPES_ICONS } from '../../../../../../constants/offering';
import ChartPie from './ChartPie';

const isTablet = document.documentElement.clientWidth < 992;
const COLORS = ['#C782FF', '#28DAC9', '#0681A1', '#86D200', '#D2FF85', '#474747'];

const PortfolioAllocations = ({ pieChart, isAdmin }) => (
  <>
    <Header as="h4">Portfolio Allocations</Header>
    <Grid celled={isTablet ? undefined : 'internally'}>
      <Grid.Row>
        <Grid.Column className="portfolio-allocation" widescreen={isAdmin ? 7 : 6} largeScreen={7} computer={7} tablet={16} mobile={16}>
          <ChartPie title="Investment Type" data={pieChart.investmentType} colors={COLORS} />
        </Grid.Column>
        <Grid.Column className="portfolio-allocation" widescreen={isAdmin ? 9 : 6} largeScreen={9} computer={9} tablet={16} mobile={16}>
          <ChartPie icons={INDUSTRY_TYPES_ICONS} title="Industry" data={pieChart.industry} colors={COLORS} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </>
);

export default PortfolioAllocations;
