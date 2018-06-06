import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';
import PrivateLayout from '../../../containers/common/PrivateHOC';
import StickyNotification from '../components/StickyNotification';

class Dashboard extends Component {
  render() {
    // const pathInfo = this.props.location.pathname.split('/app/');
    const stepinfo = {
      value: 'Verify your identity',
      label: 'Complete all required information about yourself',
      linkText: 'Verify me',
      linkPath: 'InvestorPersonalDetails',
    };
    return (
      <div>
        <PrivateLayout
          {...this.props}
          StickyNotification={
            <StickyNotification
              stepinfo={stepinfo}
              setDashboardWizardSetup={this.setDashboardWizardSetup}
            />
          }
        >
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
                <Header as="h3"><Icon name="ns-pencil" /> California 88</Header>
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
        </PrivateLayout>
      </div>
    );
  }
}

export default Dashboard;
