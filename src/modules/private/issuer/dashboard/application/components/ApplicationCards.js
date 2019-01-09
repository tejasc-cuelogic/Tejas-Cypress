import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared/index';
import { BUSINESS_APP_USER_STATUS, BUSINESS_APPLICATION_STATUS } from '../../../../../../services/constants/businessApplication';
import ApplicationTypeModal from './ApplicationTypeModal';
import DateTimeFormat from '../../../../../../theme/shared/src/DateTimeFormat';
@inject('businessAppStore')
@withRouter
@observer
export default class ApplicationCards extends Component {
  componentWillMount() {
    // getting all application list of user
    if (this.props.match.isExact) {
      this.props.businessAppStore.getBusinessApplications();
      this.props.businessAppStore.setFieldvalue('isFetchedData', null);
    }
  }
  render() {
    const { fetchBusinessApplication, businessApplicationsList } = this.props.businessAppStore;

    if (businessApplicationsList && businessApplicationsList.loading) {
      return <InlineLoader />;
    }

    return (
      <Aux>
        <Header as="h3">Applications</Header>
        <Card.Group stackable itemsPerRow={3} className="application-cards">
          <Card fluid>
            <Card.Content>
              <Header as="h4"><Icon className="ns-paper-plane" color="green" /> Create new application</Header>
              <p>Want to start a new campaing? Start new application process to proceed</p>
              <Divider hidden />
              <Button primary as={Link} to="/app/dashboard/select-application-type">Start application</Button>
            </Card.Content>
          </Card>
          {fetchBusinessApplication.length ?
            fetchBusinessApplication.map(application => (
              application.applicationStatus !== BUSINESS_APPLICATION_STATUS.APPLICATION_REMOVED &&
                <Card fluid key={application.applicationId}>
                  <Card.Content>
                    <Header as="h4"><Icon color={BUSINESS_APP_USER_STATUS[application.applicationStatus].color} name={BUSINESS_APP_USER_STATUS[application.applicationStatus].icon} /> {application.prequalDetails.businessGeneralInfo.businessName}</Header>
                  </Card.Content>
                  <Card.Content>
                    <dl className="dl-horizontal">
                      <dt>Application status</dt>
                      <dd>{BUSINESS_APP_USER_STATUS[application.applicationStatus].status}</dd>
                      <dt>Started</dt>
                      <dd>{application.created ? <DateTimeFormat datetime={application.created.date} /> : '--'}</dd>
                      <dt>{application.applicationStatus ===
                        BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED ?
                        'Submitted' : 'Last updated'
                      }
                      </dt>
                      <dd>{application.updated ? <DateTimeFormat datetime={application.updated.date} /> : '--'}</dd>
                    </dl>
                    {application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
                      <Button inverted color="green" as={Link} to={`business-application/${application.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate'}/${application.applicationId}/pre-qualification`}>Continue application</Button>
                    }
                    {application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED &&
                      <Button inverted color="green" as={Link} to={`business-application/${application.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate'}/${application.applicationId}/pre-qualification`}>View application</Button>
                    }
                    {application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_OFFERED &&
                      <Button inverted color="green" as={Link} to={`dashboard/${application.applicationId}/offers`}>Sign agreement</Button>
                    }
                    {application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL &&
                      <Aux>
                        <Button inverted color="green">View application</Button>
                        <Button inverted color="green">View offer</Button>
                      </Aux>
                    }
                  </Card.Content>
                </Card>
            )) : null
          }
        </Card.Group>
        <Route exact path="/app/dashboard/select-application-type" component={ApplicationTypeModal} />
      </Aux>
    );
  }
}
