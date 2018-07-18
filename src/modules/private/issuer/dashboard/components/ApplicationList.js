import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';

@inject('newBusinessStore', 'uiStore')
@observer
export default class ApplicationList extends Component {
  componentWillMount() {
    this.props.newBusinessStore.getBusinessApplications();
    this.props.newBusinessStore.setFetchedData(null);
  }
  render() {
    const { fetchBusinessApplication } = this.props.newBusinessStore;
    return (
      <Aux>
        <Header as="h3">Applications</Header>
        <Card.Group stackable itemsPerRow={4}>
          <Card fluid>
            <Card.Content>
              <Header as="h3"><Icon className="ns-paper-plane" color="green" /> Create new application</Header>
              <p>Want to start a new campaing? Start new application process to proceed</p>
              <Divider hidden />
              <Button primary as={Link} to="business-application/new/pre-qualification">Start new application</Button>
            </Card.Content>
          </Card>
          {fetchBusinessApplication.length ?
            fetchBusinessApplication.map(application => (
              <Card fluid>
                <Card.Content>
                  <Header as="h3"><Icon name="ns-pencil-circle-line" /> {application.prequalDetails.businessGeneralInfo.businessName}</Header>
                </Card.Content>
                <Card.Content>
                  <dl className="dl-horizontal">
                    <dt>Application status</dt>
                    <dd>{application.applicationStatus}</dd>
                    <dt>Started on</dt>
                    <dd>{moment(application.createdDate).format('MM/DD/YYYY')}</dd>
                    <dt>Last Updated Date</dt>
                    <dd>{application.updatedDate ? moment(application.updatedDate).format('MM/DD/YYYY') : '--'}</dd>
                  </dl>
                  {application.applicationStatus !== 'PRE_QUALIFICATION_FAILED' &&
                    <Button inverted color="green" as={Link} to={`business-application/${application.applicationId}/pre-qualification`}>Continue application</Button>
                  }
                </Card.Content>
              </Card>
            )) : null
          }
        </Card.Group>
      </Aux>
    );
  }
}
