import React from 'react';
import { Button, Item, Grid, Card } from 'semantic-ui-react';
import Banklogo from '../../../../../../assets/images/boa-logo.jpg';

const AccountDetailsView = props => (
  <Grid.Row>
    <Grid.Column widescreen={8} largeScreen={12} computer={13} tablet={16} mobile={16}>
      <Card fluid className="linked-bank">
        <Card.Content>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column verticalAlign="middle">
                <Item>
                  <Item.Image size="small" src={Banklogo} />
                </Item>
              </Grid.Column>
              <Grid.Column>
                <Item>
                  <Item.Content>
                    <Item.Extra>Number</Item.Extra>
                    <Item.Header>{props.accountDetails.number}</Item.Header>
                  </Item.Content>
                </Item>
              </Grid.Column>
              <Grid.Column>
                <Item>
                  <Item.Content>
                    <Item.Extra>Date linked</Item.Extra>
                    <Item.Header>{props.accountDetails.dateLinked}</Item.Header>
                  </Item.Content>
                </Item>
              </Grid.Column>
              <Grid.Column>
                <Item>
                  <Item.Content>
                    <Item.Extra>Status</Item.Extra>
                    <Item.Header>{props.accountDetails.status}</Item.Header>
                  </Item.Content>
                </Item>
              </Grid.Column>
              <Grid.Column width={5} textAlign="right" verticalAlign="middle">
                <Button inverted color="green" content="Change Linked Bank" />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid.Row>
);

export default AccountDetailsView;
