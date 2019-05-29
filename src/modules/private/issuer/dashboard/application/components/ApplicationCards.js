import React, { Component } from 'react';
import { Link, Route, withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { get } from 'lodash';
import { inject, observer } from 'mobx-react';
import { Header, Card, Button, Icon, Divider } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared/index';
import { BUSINESS_APP_USER_STATUS, BUSINESS_APPLICATION_STATUS } from '../../../../../../services/constants/businessApplication';
import ApplicationTypeModal from './ApplicationTypeModal';
import { ACTIVITY_HISTORY_TYPES, ACTIVITY_HISTORY_SCOPE } from '../../../../../../constants/common';
import DateTimeFormat from '../../../../../../theme/shared/src/DateTimeFormat';

const { clientWidth } = document.documentElement;
const isTablet = clientWidth >= 768 && clientWidth < 1300;
const isMobile = clientWidth < 768;
@inject('businessAppStore', 'activityHistoryStore')
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
  signPortalAgreementHandler = (e, url, resourceId) => {
    const payload = {
      resourceId,
      activityType: ACTIVITY_HISTORY_TYPES.OFFER,
      activityTitle: 'Issuer reviewed offer.',
      subType: 'REVIEWED',
      scope: ACTIVITY_HISTORY_SCOPE.DEV,
    };
    this.props.activityHistoryStore.createActivityHistory(payload);
    this.props.history.push(url);
  }
  render() {
    const { fetchBusinessApplication, businessApplicationsList } = this.props.businessAppStore;

    if (businessApplicationsList && businessApplicationsList.loading) {
      return <InlineLoader />;
    }

    return (
      <Aux>
        <Header as="h3" className={isMobile ? 'mb-30' : ''}>Applications</Header>
        <Card.Group stackable itemsPerRow={isTablet ? '2' : '3'} className="application-cards">
          <Card fluid>
            <Card.Content>
              <Header as="h4"><Icon className="ns-paper-plane" color="green" /> Create new application</Header>
            </Card.Content>
            <Card.Content>
              <p>Want to launch a new campaign?<br />
                Let&#39;s get started with an application for your project.
              </p>
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
                      <dt>Started on</dt>
                      <dd>{application.created ? <DateTimeFormat datetime={application.created.date} /> : '--'}</dd>
                      <dt>{BUSINESS_APP_USER_STATUS[application.applicationStatus].dateTitle}</dt>
                      <dd>{(get(application, BUSINESS_APP_USER_STATUS[application.applicationStatus].datePath) || application.updated) ? <DateTimeFormat datetime={(get(application, BUSINESS_APP_USER_STATUS[application.applicationStatus].datePath) || application.updated.date)} /> : '--'}</dd>
                    </dl>
                    {application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
                      <Button inverted color="green" as={Link} to={`/app/business-application/${application.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate'}/${application.applicationId}/pre-qualification`}>Continue application</Button>
                    }
                    {(application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED
                    || application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL ||
                    application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.REVIEW_FAILED) &&
                      <Button inverted color="green" as={Link} to={`/app/business-application/${application.applicationType === 'BUSINESS' ? 'business' : 'commercial-real-estate'}/${application.applicationId}/pre-qualification`}>View application</Button>
                    }
                    {(application.applicationStatus ===
                      BUSINESS_APPLICATION_STATUS.APPLICATION_OFFERED ||
                      application.applicationStatus ===
                      BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL) &&
                      <Button inverted color="green" onClick={e => this.signPortalAgreementHandler(e, `/app/dashboard/${application.applicationId}/offers`, application.applicationId)} >
                        { application.applicationStatus ===
                        BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL ? 'View Offer' : 'Sign agreement'
                      }
                      </Button>
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
