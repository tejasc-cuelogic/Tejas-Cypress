import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Button, Header, Divider } from 'semantic-ui-react';

const NoBeneficiary = props => (
  <Grid.Row>
    <Grid.Column widescreen={8} largeScreen={10} computer={13} tablet={16} mobile={16}>
      <Card fluid>
        <Card.Content>
          <Header as="h3">You have no beneficiaries yet</Header>
          <p>Add your first beneficiary and lorem ipsum dolor sit amet lorem ipsum dolor</p>
          <Divider hidden />
          <Card.Description>
            <Button as={Link} to={`${props.match.url}/add-beneficiary`} primary content="Add new beneficiary" />
          </Card.Description>
        </Card.Content>
      </Card>
    </Grid.Column>
  </Grid.Row>
);

export default NoBeneficiary;
