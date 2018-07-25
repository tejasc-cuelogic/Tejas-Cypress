import React from 'react';
import { Header, Segment, List, Grid } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const TermNotes = () => (
  <Grid doubling columns={2}>
    <Grid.Column>
      <Header as="h4">Term Notes</Header>
      <Header as="h3" color="blue">Raise $50,000—$1 Million</Header>
      <div className="mb-10">
        <Header as="h5" attached="top">
          What are the benefits?
        </Header>
        <Segment attached>
          Term notes offer fixed monthly payments at a set interest rate.
          Each month, your payments are steady and predictable. Plus,
          with no prepayment penalty, you can pay off the entire balance
          early without incurring a fee.
        </Segment>
      </div>
      <div className="mb-20">
        <Header as="h5" attached="top">
          Who is this option best for?
        </Header>
        <Segment attached>
        This is great for businesses with steady cash flow and the ability
        to start making payments immediately.
        </Segment>
      </div>
      <List horizontal className="learn-more-list">
        <List.Item>
          <List.Header>Learn more</List.Header>
          <List.Icon className="ns-arrow-right" color="green" />
          <List.Content as="a">Why fundraise on NextSeed?</List.Content>
        </List.Item>
      </List>
    </Grid.Column>
    <Grid.Column>
      <RevenueChart />
    </Grid.Column>
  </Grid>
);

export default TermNotes;
