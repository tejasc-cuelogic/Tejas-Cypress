import React from 'react';
import { Header, List, Grid } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const RevenueSharing = () => (
  <Grid doubling columns={2}>
    <Grid.Column>
      <Header as="h4">Revenue Sharing Notes</Header>
      <Header as="h3" color="blue">Raise $100,000—$1 Million</Header>
      <List className="funding-options">
        <List.Item>
          <List.Header as="h5">What are the benefits?</List.Header>
          With revenue sharing notes, you{"'"}re sharing a percentage of gross monthly revenues
          until you fulfill a total payment back to investors. The structure gives you the
          flexibility you need to succeed.
        </List.Item>
        <List.Item>
          <List.Header as="h5">Who is this option best for?</List.Header>
          This is ideal for new businesses that have a ramp up time
          (e.g., construction) or are driven by seasonality.
        </List.Item>
      </List>
      <List horizontal relaxed className="learn-more-list mt-20">
        <List.Item>
          <List.Header>Learn more</List.Header>
          <List.Icon className="ns-arrow-right" color="green" />
          <List.Content as="a">See how a Revenue Sharing Notes Works</List.Content>
        </List.Item>
      </List>
    </Grid.Column>
    <Grid.Column>
      <RevenueChart />
    </Grid.Column>
  </Grid>
);

export default RevenueSharing;
