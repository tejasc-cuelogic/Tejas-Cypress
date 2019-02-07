import React, { Component } from 'react';
import { Grid, Card, Button, Confirm } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const elasticSearchModules = [
  {
    module: 'users',
    title: 'Users Index',
    cta: [
      { title: 'Create', color: 'green', mutation: 'userCreateIndices' },
      { title: 'Populate', color: 'blue', mutation: 'userPopulateIndex' },
      { title: 'Delete', color: 'red', mutation: 'userDeleteIndices' },
    ],
  },
  {
    module: 'crowdPay',
    title: 'CrowdPay Index',
    cta: [
      { title: 'Create', color: 'green', mutation: 'crowdPayCreateIndices' },
      { title: 'Populate', color: 'blue', mutation: 'crowdPayPopulateIndex' },
      { title: 'Delete', color: 'red', mutation: 'crowdPayDeleteIndices' },
    ],
  },
  {
    module: 'accreditation',
    title: 'Accreditation Index',
    cta: [
      { title: 'Create', color: 'green', mutation: 'accreditationCreateIndices' },
      { title: 'Populate', color: 'blue', mutation: 'accreditationPopulateIndex' },
      { title: 'Delete', color: 'red', mutation: 'accreditationDeleteIndices' },
    ],
  },
  {
    module: 'linkedBank',
    title: 'LinkedBank Index',
    cta: [
      { title: 'Create', color: 'green', mutation: 'linkedBankCreateIndices' },
      { title: 'Populate', color: 'blue', mutation: 'linkedBankPopulateIndex' },
      { title: 'Delete', color: 'red', mutation: 'linkedBankDeleteIndices' },
    ],
  },
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
                    {es.cta.map(b => (
                      <Button onClick={() => this.toggleConfirmModal(b.mutation, `${b.title} ${es.title}`)} loading={inProgress === b.mutation} content={b.title} color={b.color} />
                    ))
                    }
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
              <ActivityHistory resourceId="ElasticSearch" />
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
