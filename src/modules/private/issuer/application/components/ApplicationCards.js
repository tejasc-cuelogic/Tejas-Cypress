import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { Header, Card, Button, Icon } from 'semantic-ui-react';
import { BUSINESS_APP_USER_STATUS, BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';
@inject('businessAppStore')
@observer
export default class ApplicationCards extends Component {
  componentWillMount() {
    this.props.businessAppStore.getBusinessApplications();
    this.props.businessAppStore.setFieldvalue('isFetchedData', null);
  }
  render() {
    const { fetchBusinessApplication } = this.props.businessAppStore;
    return (
      <Aux>
        {fetchBusinessApplication.length ?
          fetchBusinessApplication.map(application => (
            <Card fluid key={application.applicationId}>
              <Card.Content>
                <Header as="h3"><Icon color={BUSINESS_APP_USER_STATUS[application.applicationStatus].color} name={BUSINESS_APP_USER_STATUS[application.applicationStatus].icon} /> {application.prequalDetails.businessGeneralInfo.businessName}</Header>
              </Card.Content>
              <Card.Content>
                <dl className="dl-horizontal">
                  <dt>Application status</dt>
                  <dd>{BUSINESS_APP_USER_STATUS[application.applicationStatus].status}</dd>
                  <dt>Started</dt>
                  <dd>{moment(application.createdDate).format('MM/DD/YYYY')}</dd>
                  <dt>{application.applicationStatus ===
                    BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED ?
                    'Submitted' : 'Last updated'
                  }
                  </dt>
                  <dd>{application.updatedDate ? moment(application.updatedDate).format('MM/DD/YYYY') : '--'}</dd>
                </dl>
                {application.applicationStatus ===
                BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED &&
                  <Button inverted color="green" as={Link} to={`business-application/${application.applicationId}/pre-qualification`}>Continue application</Button>
                }
                {application.applicationStatus ===
                BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED &&
                  <Button inverted color="green" as={Link} to={`business-application/${application.applicationId}/pre-qualification`}>View application</Button>
                }
                {application.applicationStatus ===
                BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
                && application.lendio && application.lendio.status ===
                BUSINESS_APPLICATION_STATUS.LENDIO_PRE_QUALIFICATION_SUCCESSFUL &&
                  <Aux>
                    <Button inverted color="green" as={Link} to={`business-application/${application.applicationId}/pre-qualification`}>View application</Button>
                    <Button inverted color="green" as={Link} to={`business-application/${application.applicationId}/lendio`}>View Lendio</Button>
                  </Aux>
                }
                {application.applicationStatus ===
                BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
                && application.lendio && application.lendio.status ===
                BUSINESS_APPLICATION_STATUS.LENDIO_SUCCESS &&
                  <Button inverted color="green" onClick={() => window.open(`${application.lendio.url}`, '_blank')} target="_blank">View Lendio</Button>
                }
              </Card.Content>
            </Card>
          )) : null
        }
      </Aux>
    );
  }
}
