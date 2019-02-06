import React, { Component } from 'react';
import { Grid, Card, Button, Confirm, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const elasticSearchModules = [
  {
    module: 'users',
    title: 'Users Index',
    cta: [
      {
        title: 'Create', color: 'green', mutation: 'userCreateIndices', pos: 1,
      },
      {
        title: 'Generate', color: 'blue', mutation: 'userPopulateIndex', pos: 1,
      },
      {
        title: 'Update', color: 'blue', mutation: 'userPopulateIndex', pos: 2,
      },
      {
        title: 'Delete', color: 'red', mutation: 'userDeleteIndices', pos: 2,
      },
    ],
  },
  {
    module: 'crowdPay',
    title: 'CrowdPay Index',
    cta: [
      {
        title: 'Create', color: 'green', mutation: 'crowdPayCreateIndices', pos: 1,
      },
      {
        title: 'Generate', color: 'blue', mutation: 'crowdPayPopulateIndex', pos: 1,
      },
      {
        title: 'Update', color: 'blue', mutation: 'crowdPayPopulateIndex', pos: 2,
      },
      {
        title: 'Delete', color: 'red', mutation: 'crowdPayDeleteIndices', pos: 2,
      },
    ],
  },
  {
    module: 'accreditation',
    title: 'Accreditation Index',
    cta: [
      {
        title: 'Create', color: 'green', mutation: 'accreditationCreateIndices', pos: 1,
      },
      {
        title: 'Generate', color: 'blue', mutation: 'accreditationPopulateIndex', pos: 1,
      },
      {
        title: 'Update', color: 'blue', mutation: 'accreditationPopulateIndex', pos: 2,
      },
      {
        title: 'Delete', color: 'red', mutation: 'accreditationDeleteIndices', pos: 2,
      },
    ],
  },
  {
    module: 'linkedBank',
    title: 'LinkedBank Index',
    cta: [
      {
        title: 'Create', color: 'green', mutation: 'linkedBankCreateIndices', pos: 1,
      },
      {
        title: 'Generate', color: 'blue', mutation: 'linkedBankPopulateIndex', pos: 1,
      },
      {
        title: 'Update', color: 'blue', mutation: 'linkedBankPopulateIndex', pos: 2,
      },
      {
        title: 'Delete', color: 'red', mutation: 'linkedBankDeleteIndices', pos: 2,
      },
    ],
  },
];

const ButtonGroup = props => (
  <Button.Group compact>
    {props.es.cta.map(b => b.pos === props.pos && (
      <Button onClick={() => props.toggleConfirmModal(b.mutation, `${b.title} ${props.es.title}`)} loading={props.inProgress === b.mutation} size="mini" content={b.title} color={b.color} />
    ))
    }
  </Button.Group>
);
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
      { title: 'Activity History', to: 'activity-history' },
    ];
    return (
      <Grid>
        <Grid.Column width={4}>
          {elasticSearchModules.map(es => (
            <Card fluid>
              <Card.Content header={es.title} />
              <Card.Content>
                <Card.Description>
                  <ButtonGroup
                    toggleConfirmModal={this.toggleConfirmModal}
                    es={es}
                    pos={1}
                    inProgress={inProgress}
                  />
                  <Divider hidden />
                  <ButtonGroup
                    toggleConfirmModal={this.toggleConfirmModal}
                    es={es}
                    pos={2}
                    inProgress={inProgress}
                  />
                </Card.Description>
              </Card.Content>
            </Card>
          ))
          }
        </Grid.Column>
        <Grid.Column width={12}>
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
