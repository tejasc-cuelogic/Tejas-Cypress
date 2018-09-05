import React from 'react';
import { Header, List, Grid } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const TermNotes = () => (
  <Grid reversed="computer" doubling columns={2}>
    <Grid.Column>
      <RevenueChart />
    </Grid.Column>
    <Grid.Column>
      <Header as="h4">Term Notes</Header>
      <Header as="h3" color="blue">Raise $50,000—$1 Million</Header>
      <List className="funding-options">
        <List.Item>
          <List.Header as="h5">What are the benefits?</List.Header>
          Term notes offer fixed monthly payments at a set interest rate.
          Each month, your payments are steady and predictable. Plus,
          with no prepayment penalty, you can pay off the entire balance
          early without incurring a fee.
        </List.Item>
        <List.Item>
          <List.Header as="h5">Who is this option best for?</List.Header>
          This is great for businesses with steady cash flow and the ability
          to start making payments immediately.
        </List.Item>
      </List>
      <List horizontal className="learn-more-list mt-20">
        <List.Item>
          <List.Header>Learn more</List.Header>
          <List.Icon className="ns-arrow-right" color="green" />
          <List.Content as="a">See how a Term Note Works</List.Content>
        </List.Item>
      </List>
    </Grid.Column>
  </Grid>
);

export default TermNotes;
