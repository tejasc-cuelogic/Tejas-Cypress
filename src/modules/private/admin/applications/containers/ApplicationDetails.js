import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route, Switch } from 'react-router-dom';
import { Modal, Card, Header, Label, Rating, Button, Grid, List, Icon } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { DataFormatter } from '../../../../../helper';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { InlineLoader, EmptyDataSet } from '../../../../../theme/shared';
import { BUSINESS_APPLICATION_STATUS } from '../../../../../services/constants/businessApplication';

const navItems = [
  { title: 'Activity History', to: 'activity-history' },
  { title: 'Pre-qualification', to: 'pre-qualification' },
  { title: 'Business Details', to: 'business-details' },
  { title: 'Performance', to: 'performance' },
  { title: 'Documentation', to: 'documentation' },
  { title: 'Review', to: 'review' },
];

const getModule = component => Loadable({
  loader: () => import(`../components/details/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

@inject('businessAppStore')
@observer
export default class ApplicationDetails extends Component {
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
  render() {
    const { match, businessAppStore } = this.props;
    const {
      businessApplicationDetailsAdmin, businessApplicationsDataById,
    } = businessAppStore;
    if (businessApplicationsDataById && businessApplicationsDataById.loading) {
      return <InlineLoader />;
    }
    if (!businessApplicationDetailsAdmin) {
      return <EmptyDataSet />;
    }
    const { applicationStatus, prequalDetails, primaryPOC } = businessApplicationDetailsAdmin;
    const appStepStatus = applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_FAILED ? 'Failed' : applicationStatus === BUSINESS_APPLICATION_STATUS.PRE_QUALIFICATION_SUBMITTED ? 'In-Progress' : 'Completed';
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            {prequalDetails.businessGeneralInfo.businessName}
            <span className="title-meta">Status: <b>{appStepStatus}</b></span>
            <Label size="small" color="green">Reviewed</Label>
            <span className="title-meta">Rating</span>
            <Rating size="huge" disabled defaultRating={3} maxRating={5} />
            <Button secondary compact floated="right" content="Promote" />
          </Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>
                    Information
                    <small className="pull-right"><Link to="/"><Icon className="ns-pencil" />Edit</Link></small>
                  </Card.Header>
                  <Card.Content>
                    <Grid columns={2}>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Business Name</Header.Subheader>
                          {prequalDetails.businessGeneralInfo.businessName}
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Sign-up Code</Header.Subheader>
                          joedoe
                        </Header>
                      </Grid.Column>
                    </Grid>
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
                          {primaryPOC.phone ? primaryPOC.phone : '-'}
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
              <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
              {
                navItems.map(item => (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    component={getModule(this.module(item.title))}
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
