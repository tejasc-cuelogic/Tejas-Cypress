import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';
import ApplicationCards from '../components/ApplicationCards';

export default class ApplicationList extends Component {
  render() {
    return (
      <Aux>
        <Header as="h3">Applications</Header>
        <Card.Group stackable itemsPerRow={3} className="application-cards">
          <Card fluid>
            <Card.Content>
              <Header as="h3"><Icon className="ns-paper-plane" color="green" /> Create new application</Header>
              <p>Want to start a new campaing? Start new application process to proceed</p>
              <Divider hidden />
              <Button primary as={Link} to="/app/business-application/new/pre-qualification">Start application</Button>
            </Card.Content>
          </Card>
          <ApplicationCards />
        </Card.Group>
      </Aux>
    );
  }
}
