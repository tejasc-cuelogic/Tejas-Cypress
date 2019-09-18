import React, { Component, Suspense, lazy } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import { Modal, Card, Header, Form, Rating, Button, Grid, List, Icon } from 'semantic-ui-react';
import ActivityHistory from '../../../shared/ActivityHistory';
import { DataFormatter } from '../../../../../helper';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader } from '../../../../../theme/shared';
import { FormInput } from '../../../../../theme/form';
import { AppStatusLabel } from '../components/AppStatusLabel';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';
import { ACTIVITY_HISTORY_TYPES } from '../../../../../constants/common';

const getModule = component => lazy(() => import(`../components/details/${component}`));

@inject('businessAppStore', 'businessAppAdminStore', 'businessAppReviewStore', 'uiStore')
@observer
export default class ApplicationDetails extends Component {
  state = {
    displayOnly: true,
  }

  constructor(props) {
    super(props);
    const { match } = this.props;
    const { params } = match;
    if (this.props.businessAppStore.applicationId !== params.appId) {
      this.props.businessAppStore.fetchAdminApplicationById(params.appId, params.id, params.userId)
        .then(() => {
          if (match.isExact) {
            this.props.history.push(`${match.url}/activity-history`);
          }
        });
    }
  }

  componentDidMount() {
    window.onpopstate = this.handleCloseModal;
  }

  module = name => DataFormatter.upperCamelCase(name);

  handleCloseModal = (e) => {
    e.stopPropagation();
    const { params } = this.props.match;
    this.props.businessAppStore.setFieldvalue('applicationId', null);
    this.props.businessAppReviewStore.setFieldvalue('initLoad', []);
    this.props.businessAppReviewStore.setFieldvalue('expAnnualRevCount', 4);
    this.props.history.push(`/app/applications/${params.id}`);
    this.props.businessAppReviewStore.resetForm('OFFERS_FRM');
    window.onpopstate = null;
  };

  editBusinessDetails = (e) => {
    e.preventDefault();
    this.setState({ displayOnly: !this.state.displayOnly });
  }

  updateBusinessDetails = (e, appId, appUserId) => {
    e.preventDefault();
    this.props.businessAppAdminStore.updateBusinessDetails(appId, appUserId).then(() => {
      this.setState({ displayOnly: !this.state.displayOnly });
    });
  }

  cancelBusinessDetails = (e, businessName, signupCode) => {
    e.preventDefault();
    this.setState({ displayOnly: !this.state.displayOnly });
    this.props.businessAppAdminStore.setBusinessDetails(businessName, signupCode);
  }

  updateApplicationStatus = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    this.props.businessAppReviewStore
      .updateApplicationStatus(params.appId, params.userId, 'PRE_QUALIFICATION_PROMOTED', 'PROMOTE')
      .then(() => {
        this.props.uiStore.setErrors(null);
        this.props.history.push('/app/applications/in-progress');
      });
  }

  render() {
    const { match, businessAppStore, businessAppAdminStore } = this.props;
    const {
      businessApplicationDetailsAdmin,
    } = businessAppStore;
    const { BUSINESS_DETAILS_EDIT_FRM, inputFieldChnage } = businessAppAdminStore;
    const { fields } = BUSINESS_DETAILS_EDIT_FRM;
    if (!businessApplicationDetailsAdmin) {
      return <InlineLoader />;
    }
    const {
      id, applicationId, userId, applicationStatus, prequalStatus, prequalDetails, primaryPOC,
      signupCode, rating, businessGeneralInfo, firstName, lastName, failReasons, email, deleted,
      stashed, applicationStage,
    } = businessApplicationDetailsAdmin;
    let navItems = [
      { title: 'Activity History', to: 'activity-history', component: ActivityHistory },
      { title: 'Pre-qualification', to: 'pre-qualification' },
    ];
    if ((applicationStatus || prequalStatus)
    !== BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
      navItems = [
        ...navItems,
        { title: 'Business Details', to: 'business-details' },
        { title: 'Performance', to: 'performance' },
        { title: 'Documentation', to: 'documentation' },
      ];
    }
    if (!deleted && !stashed && ((applicationStatus || prequalStatus)
    === BUSINESS_APPLICATION_STATUS.APPLICATION_SUBMITTED
    || (applicationStatus || prequalStatus)
    === BUSINESS_APPLICATION_STATUS.APPLICATION_OFFERED || (applicationStatus || prequalStatus)
    === BUSINESS_APPLICATION_STATUS.APPLICATION_SUCCESSFUL)) {
      navItems = [
        ...navItems,
        { title: 'Review', to: 'review' },
      ];
    }
    const { inProgress } = this.props.uiStore;
    const { businessName, contactDetails } = businessGeneralInfo || prequalDetails.businessGeneralInfo;
    const appStepStatus = (applicationStatus || prequalStatus) === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'Failed' : (applicationStatus || prequalStatus) === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED ? 'In-Progress' : 'Completed';
    const appStatus = appStepStatus === 'Failed' ? 'prequal-failed' : 'in-progress';
    return (
      <Modal closeIcon size="large" dimmer="inverted" open closeOnDimmerClick={false} onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Header as="h3">
            {businessName}
            <span className="title-meta">  Status: <b>{appStepStatus}</b></span>
            <AppStatusLabel application={businessApplicationDetailsAdmin} />
            <span className="title-meta">Rating</span>
            <Rating size="huge" disabled defaultRating={rating || 0} maxRating={5} />
            {((prequalStatus)
            === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED)
            && <Button secondary compact floated="right" content="Promote" as={Link} to={`${this.props.refLink}/${appStatus}/${id || applicationId}/${userId || 'new'}/${prequalStatus || 'APPLICATION_IN_PROGRESS'}/PROMOTE/confirm`} />
            }

            {((applicationStatus)
            === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED || applicationStage === 'IN_PROGRESS')
            && <Button secondary compact loading={inProgress} floated="right" content="Promote" onClick={this.updateApplicationStatus} />
            }
          </Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>
                    Information
                    {(applicationStatus || prequalStatus)
                    !== BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
                    && (
<small className="pull-right">
                      {this.state.displayOnly
                        ? <Link to="/" onClick={this.editBusinessDetails}><Icon className="ns-pencil" />Edit</Link>
                        : (
                          <>
                            <Link to="/" className="text-link" onClick={e => this.cancelBusinessDetails(e, businessName, signupCode)}>Cancel</Link>
                            <Link to="/" className={!BUSINESS_DETAILS_EDIT_FRM.meta.isValid ? 'disabled' : ''} onClick={e => this.updateBusinessDetails(e, applicationId, userId, (applicationStatus || prequalStatus))}>
                              <Icon name="save" />
Update
                            </Link>
                          </>
                        )
                      }
                    </small>
                    )
                    }
                  </Card.Header>
                  <Card.Content>
                    <Form>
                      <Form.Group widths="2">
                        {
                          ['businessName', 'signupCode', 'utmSource'].map(field => (
                            <FormInput
                              containerclassname={this.state.displayOnly ? 'display-only' : ''}
                              readOnly={this.state.displayOnly}
                              key={field}
                              type="text"
                              name={field}
                              fielddata={fields[field]}
                              changed={inputFieldChnage}
                            />
                          ))
                        }
                      </Form.Group>
                    </Form>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>Primary POC</Card.Header>
                  <Card.Content>
                    <Grid columns={2}>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Name</Header.Subheader>
                          {firstName || primaryPOC.firstName} {lastName || primaryPOC.lastName}
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Email</Header.Subheader>
                          {email || primaryPOC.email}
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Phone</Header.Subheader>
                          {contactDetails && contactDetails.phone ? contactDetails.phone.number : '-'}
                        </Header>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </Card>
              </Grid.Column>
              {(applicationStatus || prequalStatus)
              === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED
                && (
<Grid.Column>
                  <Card fluid className="ba-info-card">
                    <Card.Header>Failed Reason</Card.Header>
                    <Card.Content>
                      {(failReasons.length || prequalDetails.failReasons.length)
                        ? <List as="ol">{(failReasons || prequalDetails.failReasons).map(reason => <List.Item as="li" value="-">{reason}</List.Item>)}</List>
                        : <p>-</p>
                      }
                    </Card.Content>
                  </Card>
                </Grid.Column>
                )
              }
            </Grid.Row>
          </Grid>
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Suspense fallback={<InlineLoader />}>
              <Switch>
                <Route
                  exact
                  path={match.url}
                  component={navItems[0].component || getModule(this.module(navItems[0].title))}
                />
                {
                  navItems.map((item) => {
                    const { params } = match;
                    const CurrentComponent = (item.component || getModule(this.module(item.title)));
                    return (
                      <Route
                        key={item.to}
                        path={`${match.url}/${item.to}`}
                        render={props => (
                          <CurrentComponent
                            module={item.title === 'Activity History' ? 'applicationDetails' : false}
                            showFilters={item.title === 'Activity History' ? ['activityType', 'activityUserType'] : false}
                            resourceId={params.appId}
                            appType={params.id}
                            activityTitle="Comment"
                            activityType={ACTIVITY_HISTORY_TYPES.COMMENT}
                            {...props}
                          />
                        )
                        }
                      />
                    );
                  })
                }
              </Switch>
            </Suspense>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
