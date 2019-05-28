import React, { Component } from 'react';
import { Grid, Card, Button, Confirm, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { map, capitalize, get } from 'lodash';
import Aux from 'react-aux';
import moment from 'moment';
import { Route, withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import { InlineLoader } from './../../../../../theme/shared';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import EsAudit from './EsAudit';

@inject('elasticSearchStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  state = {
    confirmModal: false,
    title: '',
    alias: null,
    module: '',
  };
  componentWillMount() {
    this.props.elasticSearchStore.getESAudit();
  }
  elasticSearchHandler = (alias, module) => {
    this.cancelConfirmModal();
    if (module === 'AUDIT') {
      this.props.history.push(`${this.props.match.url}/audit`);
    } else {
      this.props.elasticSearchStore.elasticSearchHandler(alias, module);
    }
  }
  toggleConfirmModal = (alias, title, module) => {
    this.setState({
      confirmModal: true, alias, title, module,
    });
  }
  cancelConfirmModal = () => {
    this.setState({
      confirmModal: false, alias: null, title: '', module: '',
    });
  }
  renderTitle = title => capitalize(title.replace('_', ' '));
  render() {
    const { match, elasticSearchStore } = this.props;
    const { inProgress, eSAudit, eSAuditLoading } = elasticSearchStore;
    const navItems = [
      { title: 'Activity History', to: '' },
    ];
    if (eSAuditLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Grid>
          <Grid.Column width={5}>
            {eSAudit.length ?
            map(eSAudit, es => (
              <Card fluid className="elastic-search">
                <Card.Content>
                  <Grid>
                    <Grid.Column width={7} verticalAlign="middle">
                      <Header as="h5" className="mt-0">{`${this.renderTitle(es.alias)} Indices`}</Header>
                    </Grid.Column>
                    <Grid.Column width={9} floated="right">
                      <Button.Group compact widths={2}>
                        <Button onClick={() => this.toggleConfirmModal(es.alias, `Swap ${this.renderTitle(es.alias)} Indices`, 'SWAP')} loading={inProgress === `${es.alias}_SWAP`} content="Swap" color="blue" />
                        <Button onClick={() => this.toggleConfirmModal(es.alias, `Audit ${this.renderTitle(es.alias)} Indices`, 'AUDIT')} loading={inProgress === `${es.alias}_AUDIT`} content="Audit" primary />
                      </Button.Group>
                    </Grid.Column>
                  </Grid>
                </Card.Content>
                <Card.Content>
                  {map(['index_a', 'index_b'], e => (
                    <Header as="h5">
                      {get(es, 'active') === get(es[e], 'indexName') ?
                        <Button floated="right" compact disabled content="Primary" /> :
                        <Aux>
                          <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `Populate ${this.renderTitle(es.alias)} Indices`, 'POPULATE')} loading={inProgress === `${es.alias}_POPULATE`} content="Generate" color="blue" />
                          <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `DELETE ${this.renderTitle(es.alias)} Indices`, 'DELETE')} loading={inProgress === `${es.alias}_DELETE`} content="Delete" color="red" />
                        </Aux>
                      }
                      {this.renderTitle(get(es[e], 'indexName'))}
                      <Header.Subheader>{get(es[e], 'created.date') ? moment(get(es[e], 'created.date')).startOf('hour').fromNow() : ''}</Header.Subheader>
                    </Header>
                  ))}
                </Card.Content>
              </Card>
            )) : null
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
            onConfirm={() => this.elasticSearchHandler(this.state.alias, this.state.module)}
            size="mini"
            className="deletion"
          />
        </Grid>
        <Route exact path={`${match.url}/audit`} component={EsAudit} />
      </Aux>
    );
  }
}
