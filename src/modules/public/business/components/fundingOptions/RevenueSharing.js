import React from 'react';
import { Header, List, Grid, Item } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const RevenueSharing = () => (
  <Grid reversed="computer" doubling columns={2}>
    <Grid.Column>
      <RevenueChart />
      <p className="caption-note">For illustrative purposes only.</p>
    </Grid.Column>
    <Grid.Column>
      <Header as="h3">Revenue Sharing Notes</Header>
      {/* <Header as="h3" color="blue">Raise $100,000—$1 Million</Header> */}
      <Item.Group relaxed="very" className="question-list">
        <Item>
          <Item.Content>
            <Header as="h5">
              What are the benefits?
            </Header>
            <Item.Description>
              With revenue sharing notes, you{"'"}re sharing a percentage of gross monthly revenues
              until you fulfill a total payment back to investors. The structure gives you the
              flexibility you need to succeed.
            </Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Header as="h5">
              Who is this option best for?
            </Header>
            <Item.Description>
              This is ideal for new businesses that have a ramp up time
              (e.g., construction) or are driven by seasonality.
            </Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
      <List horizontal relaxed className="learn-more-list mt-20">
        <List.Item>
          <List.Header>Learn more</List.Header>
          <List.Icon className="ns-arrow-right" color="green" />
          <List.Content as="a">See how a Revenue Sharing Notes Works</List.Content>
        </List.Item>
      </List>
    </Grid.Column>
  </Grid>
);

export default RevenueSharing;
