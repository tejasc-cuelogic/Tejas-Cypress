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
          {eSAudit.length &&
          map(eSAudit, es => (
            <Card fluid className="elastic-search">
              <Card.Content>
                <Card.Header>{`${this.renderTitle(es.alias)} Indices`}</Card.Header>
                <Button onClick={() => this.toggleConfirmModal('swapIndexAliases', `Swap ${this.renderTitle(es.alias)}`)} loading={inProgress === `${es.alias}swapIndexAliases`} content="Swap" color="blue" />
              </Card.Content>
              <Card.Content>
                {map(['index_a', 'index_b'], e => (
                  <Card.Description>
                    <Header as="h5">
                      {this.renderTitle(e)}
                      <Header.Subheader>1 Days</Header.Subheader>
                    </Header>
                    <Button.Group compact size="mini" widths={3}>
                      <Button onClick={() => this.toggleConfirmModal('getESAudit', `Audit ${this.renderTitle(e)} on ${this.renderTitle(e)}`, e)} loading={inProgress === `${e}DeleteIndices`} content="Audit" primary />
                      <Button onClick={() => this.toggleConfirmModal(`${e}PopulateIndex`, `Populate ${this.renderTitle(e)} on ${this.renderTitle(e)}`, e)} loading={inProgress === `${e}PopulateIndex`} content="Generate" color="blue" />
                    </Button.Group>
                  </Card.Description>
                  ))}
              </Card.Content>
            </Card>
          ))
          }
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
