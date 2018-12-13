import React from 'react';
import { Header, Grid, Item, Divider, Button } from 'semantic-ui-react';
import RevenueChart from './RevenueChart';

const RevenueSharingNotes = () => (
  <Grid reversed="computer" doubling columns={2} relaxed="very">
    <Grid.Column>
      <RevenueChart chartFor="RevenuSharingNote" />
      <p className="caption-note">
        {/* This example is for illustrative purposes only and does not reflect an actual
        deal or performance. The terms of each deal may differ. Payments are not
        guaranteed or insured and investors may lose some or all of the principal
        invested if the business cannot make its payments. */}
      </p>
    </Grid.Column>
    <Grid.Column>
      <Header as="h3">Revenue Sharing Notes</Header>
      {/* <Header as="h3" color="blue">Raise $100,000—$1 Million</Header> */}
      <Item.Group relaxed="very" className="question-list">
        <Item>
          <Item.Content>
            <Header as="h5">
              How does it work?
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
      <Divider hidden />
      <Button secondary>Apply Now</Button>
      {/* <List horizontal relaxed className="learn-more-list mt-20">
        <List.Item>
          <List.Header>Learn more</List.Header>
          <List.Content>
            See how <a href="/">Revenue Sharing Notes Works</a>
          </List.Content>
        </List.Item>
      </List> */}
    </Grid.Column>
  </Grid>
);

export default RevenueSharingNotes;
