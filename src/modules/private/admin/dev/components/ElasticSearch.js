import React, { Component } from 'react';
import { Grid, Card, Button, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const elasticSearchModules = [
  { module: 'user', title: 'Users Index' },
  { module: 'crowdPay', title: 'CrowdPay Index' },
  { module: 'accreditation', title: 'Accreditation Index' },
  { module: 'linkedBank', title: 'LinkedBank Index' },
];

@inject('elasticSearchStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  state = { confirmModal: false, title: '', mutation: null };
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
  render() {
    const { match, elasticSearchStore } = this.props;
    const { inProgress } = elasticSearchStore;
    const navItems = [
      { title: 'Activity History', to: '' },
    ];
    return (
      <Grid>
        <Grid.Column width={5}>
          {elasticSearchModules.map(es => (
            <Card fluid className="elastic-search">
              <Card.Content header={es.title} />
              <Card.Content>
                <Card.Description>
                  <Button.Group compact size="mini" widths={3}>
                    {/* <Button onClick={() => this.toggleConfirmModal(`${es.module}
                  CreateIndices`, `Create ${es.title}`)} loading={inProgress === 
                  `${es.module}CreateIndices`} content="Create" color="green" /> */}
                    <Button onClick={() => this.toggleConfirmModal(`${es.module}PopulateIndex`, `Populate ${es.title}`)} loading={inProgress === `${es.module}PopulateIndex`} content="Generate" color="blue" />
                    <Button onClick={() => this.toggleConfirmModal(`${es.module}DeleteIndices`, `Delete ${es.title}`)} loading={inProgress === `${es.module}DeleteIndices`} content="Delete" color="red" />
                  </Button.Group>
                </Card.Description>
              </Card.Content>
            </Card>
          ))
          }
        </Grid.Column>
        <Grid.Column width={11}>
          <div className="sticky-sidebar">
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
              <ActivityHistory resourceId="ELASTIC_SEARCH" />
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
