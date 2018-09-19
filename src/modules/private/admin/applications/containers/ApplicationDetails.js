import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import { Modal, Card, Header, Form, Label, Rating, Button, Grid, List, Icon } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import ActivityHistory from '../../../shared/ActivityHistory';
import { DataFormatter } from '../../../../../helper';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader, EmptyDataSet } from '../../../../../theme/shared';
import { FormInput } from '../../../../../theme/form';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

let navItems = [
  { title: 'Activity History', to: 'activity-history', component: ActivityHistory },
  { title: 'Pre-qualification', to: 'pre-qualification' },
];

const getModule = component => Loadable({
  loader: () => import(`../components/details/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('businessAppStore', 'businessAppAdminStore')
@observer
export default class ApplicationDetails extends Component {
  state = {
    displaOnly: true,
  }
  componentWillMount() {
    const { match } = this.props;
    const { params } = match;
    this.props.businessAppStore.fetchAdminApplicationById(params.appId, params.id, params.userId)
      .then(() => {
        if (match.isExact) {
          this.props.history.push(`${match.url}/activity-history`);
        }
      });
  }
  module = name => DataFormatter.upperCamelCase(name);
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };
  editBusinessDetails = (e) => {
    e.preventDefault();
    this.setState({ displaOnly: !this.state.displaOnly });
  }
  updateBusinessDetails = (e, appId, appUserId) => {
    e.preventDefault();
    this.props.businessAppAdminStore.updateBusinessDetails(appId, appUserId).then(() => {
      this.setState({ displaOnly: !this.state.displaOnly });
    });
  }
  cancelBusinessDetails = (e, businessName, signupCode) => {
    e.preventDefault();
    this.setState({ displaOnly: !this.state.displaOnly });
    this.props.businessAppAdminStore.setBusinessDetails(businessName, signupCode);
  }
  render() {
    const { match, businessAppStore, businessAppAdminStore } = this.props;
    const {
      businessApplicationDetailsAdmin, businessApplicationsDataById,
    } = businessAppStore;
    const { BUSINESS_DETAILS_EDIT_FRM, inputFieldChnage } = businessAppAdminStore;
    const { fields } = BUSINESS_DETAILS_EDIT_FRM;
    if (businessApplicationsDataById && businessApplicationsDataById.loading) {
      return <InlineLoader />;
    }
    if (!businessApplicationDetailsAdmin) {
      return <EmptyDataSet />;
    }
    const {
      applicationId, userId, applicationStatus, prequalDetails, primaryPOC, signupCode, rating,
    } = businessApplicationDetailsAdmin;
    if (applicationStatus !== BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED) {
      navItems = [
        ...navItems,
        { title: 'Business Details', to: 'business-details' },
        { title: 'Performance', to: 'performance' },
        { title: 'Documentation', to: 'documentation' },
        { title: 'Review', to: 'review' },
      ];
    }
    const { businessName, contactDetails } = prequalDetails.businessGeneralInfo;
    const appStepStatus = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'Failed' : applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED ? 'In-Progress' : 'Completed';
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            {businessName}
            <span className="title-meta">Status: <b>{appStepStatus}</b></span>
            <Label size="small" color="green">Reviewed</Label>
            <span className="title-meta">Rating</span>
            <Rating size="huge" disabled defaultRating={rating || 0} maxRating={5} />
            {applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED &&
            <Button secondary compact floated="right" content="Promote" />
            }
          </Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>
                    Information
                    <small className="pull-right">
                      {this.state.displaOnly ?
                        <Link to="/" onClick={this.editBusinessDetails}><Icon className="ns-pencil" />Edit</Link>
                      :
                        <Aux>
                          <Link to="/" className="text-link" onClick={e => this.cancelBusinessDetails(e, businessName, signupCode)}>Cancel</Link>
                          <Link to="/" className={!BUSINESS_DETAILS_EDIT_FRM.meta.isValid ? 'disabled' : ''} onClick={e => this.updateBusinessDetails(e, applicationId, userId, applicationStatus)}><Icon name="save" />Update</Link>
                        </Aux>
                        // <Button.Group>
                        //   <Button
                        //     size="tiny"
                        //     color="violet"
                        //     className="ghost-button additional-field"
                        //     content="Cancel"
                        //   />
                        //   <Button
                        //     disabled={!BUSINESS_DETAILS_EDIT_FRM.meta.isValid}
                        //     size="tiny"
                        //     onClick={e => this
                        //     color="violet"
                        //     className="ghost-button additional-field"
                        //     content="Update"
                        //   />
                        // </Button.Group>
                      }
                    </small>
                  </Card.Header>
                  <Card.Content>
                    <Form>
                      <Form.Group widths="equal">
                        {
                          ['businessName', 'signupCode'].map(field => (
                            <FormInput
                              containerclassname={this.state.displaOnly ? 'display-only' : ''}
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
                          {primaryPOC.firstName} {primaryPOC.lastName}
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Email</Header.Subheader>
                          {primaryPOC.email}
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
              {applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED &&
                <Grid.Column>
                  <Card fluid className="ba-info-card">
                    <Card.Header>Failed Reason</Card.Header>
                    <Card.Content>
                      {prequalDetails.failReasons.length ?
                        <List as="ol">{prequalDetails.failReasons.map(reason => <List.Item as="li" value="-">{reason}</List.Item>)}</List>
                        : <p>-</p>
                      }
                    </Card.Content>
                  </Card>
                </Grid.Column>
              }
            </Grid.Row>
          </Grid>
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route
                exact
                path={match.url}
                component={navItems[0].component || getModule(this.module(navItems[0].title))}
              />
              {
                navItems.map(item => (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    component={item.component || getModule(this.module(item.title))}
                  />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
