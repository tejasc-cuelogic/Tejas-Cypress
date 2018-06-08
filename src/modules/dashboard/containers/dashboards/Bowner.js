import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';

export default class Bowner extends Component {
  render() {
    return (
      <Aux>
        <Header as="h3">Applications</Header>
        <Card.Group itemsPerRow={4}>
          <Card fluid>
            <Card.Content>
              <Header as="h3"><Icon className="ns-paper-plane" color="green" /> Create new application</Header>
              <p>Want to start a new campaing? Start new application process to proceed</p>
              <Divider hidden />
              <Button primary as={Link} to="business-application/pre-qualification">Start new application</Button>
            </Card.Content>
          </Card>
          <Card fluid>
            <Card.Content>
              <Header as="h3"><Icon name="ns-pencil-circle-line" /> California 88</Header>
            </Card.Content>
            <Card.Content>
              <dl className="dl-horizontal">
                <dt>Application status</dt>
                <dd>In-progress</dd>
                <dt>Started on</dt>
                <dd>April 9, 2018</dd>
                <dt>Last Updated Date</dt>
                <dd>April 12, 2018</dd>
              </dl>
              <Button inverted color="green" as={Link} to="business-application/pre-qualification">Continue application</Button>
            </Card.Content>
          </Card>
        </Card.Group>
      </Aux>
    );
  }
}
