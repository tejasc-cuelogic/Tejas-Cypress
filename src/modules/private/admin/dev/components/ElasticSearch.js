import React, { Component } from 'react';
import { Grid, Card, Button, Confirm, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { map, capitalize } from 'lodash';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

// const elasticSearchModules = [
//   { module: 'user', title: 'Users Indices' },
//   { module: 'crowdPay', title: 'CrowdPay Indices' },
//   { module: 'accreditation', title: 'Accreditation Indices' },
//   { module: 'linkedBank', title: 'LinkedBank Indices' },
//   { module: 'offerings', title: 'Offerings Indices' },
// ];

@inject('elasticSearchStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  state = { confirmModal: false, title: '', mutation: null };
  componentWillMount() {
    this.props.elasticSearchStore.getESAudit();
  }
  elasticSearchHandler = (mutation) => {
    this.cancelConfirmModal();
    this.props.elasticSearchStore.elasticSearchHandler(mutation);
  }
  toggleConfirmModal = (mutation, title) => {
    this.setState({ confirmModal: true, mutation, title });
  }
  cancelConfirmModal = () => {
    this.setState({ confirmModal: false, mutation: null, title: '' });
  }
  renderTitle = title => capitalize(title.replace('_', ' '));
  render() {
    const { match, elasticSearchStore } = this.props;
    const { inProgress, eSAudit } = elasticSearchStore;
    const navItems = [
      { title: 'Activity History', to: '' },
    ];
    return (
      <Grid>
        <Grid.Column width={5}>
          {eSAudit && eSAudit.length ?
          map(eSAudit, (es, key) => (
            <Card fluid className="elastic-search">
              <Card.Content>
                <Card.Header>{`${this.renderTitle(key)} Indices`}</Card.Header>
                <Button onClick={() => this.toggleConfirmModal('swapIndexAliases', `Swap ${this.renderTitle(key)}`)} loading={inProgress === `${key}swapIndexAliases`} content="Swap" color="blue" />
              </Card.Content>
              <Card.Content>
                {es ?
                  map(es, (e, k) => k !== 'active' && (
                    <Card.Description>
                      <Header as="h5">
                        {this.renderTitle(k)}
                        <Header.Subheader>1 Days</Header.Subheader>
                      </Header>
                      <Button.Group compact size="mini" widths={3}>
                        <Button onClick={() => this.toggleConfirmModal('getESAudit', `Audit ${this.renderTitle(key)} on ${this.renderTitle(k)}`, key)} loading={inProgress === `${key}DeleteIndices`} content="Audit" primary />
                        <Button onClick={() => this.toggleConfirmModal(`${key}PopulateIndex`, `Populate ${this.renderTitle(key)} on ${this.renderTitle(k)}`, key)} loading={inProgress === `${key}PopulateIndex`} content="Generate" color="blue" />
                      </Button.Group>
                    </Card.Description>
                  )) : null
                }
              </Card.Content>
            </Card>
          )) : null
          }
          <Card fluid className="elastic-search">
            <Card.Content>
              <Grid>
                <Grid.Column width={7} verticalAlign="middle">
                  <Header as="h5" className="mt-0">Users Indices</Header>
                </Grid.Column>
                <Grid.Column width={9} floated="right">
                  <Button.Group compact widths={2}>
                    <Button onClick={() => this.toggleConfirmModal('swapIndexAliases', 'Swap')} loading={inProgress === ''} content="Swap" color="blue" />
                    <Button onClick={() => this.toggleConfirmModal('getESAudit', 'Audit', 0)} loading={inProgress === 'ds'} content="Audit" primary />
                  </Button.Group>
                </Grid.Column>
              </Grid>
            </Card.Content>
            <Card.Content>
              <Header as="h5">
                <Button floated="right" compact onClick={() => this.toggleConfirmModal('PopulateIndex', 'Populate on ', '')} loading={inProgress === 'PopulateIndex'} content="Generate" color="blue" />
                Index A
                <Header.Subheader>1 Days</Header.Subheader>
              </Header>
              <Header as="h5">
                <Button floated="right" compact disabled onClick={() => this.toggleConfirmModal('PopulateIndex', 'Populate on ', '')} loading={inProgress === 'PopulateIndex'} content="Primary" />
                Index B
                <Header.Subheader>1 Days</Header.Subheader>
              </Header>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={11}>
          <div className="sticky-sidebar">
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
              <ActivityHistory module="elasticSearch" showFilters={['activityType', 'activityUserType', 'ActivityDate', 'subType']} resourceId="ELASTIC_SEARCH" />
            </Card>
          </div>
        </Grid.Column>
        <Confirm
          header="Confirm"
          cancelButton="No"
          confirmButton="Yes"
          content={`Are you sure to proceed with ${this.state.title}.`}
          open={this.state.confirmModal}
          onCancel={this.cancelConfirmModal}
          onConfirm={() => this.elasticSearchHandler(this.state.mutation)}
          size="mini"
          className="deletion"
        />
      </Grid>
    );
  }
}
