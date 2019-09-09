import React, { Component } from 'react';
import { Grid, Card, Button, Confirm, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { map, capitalize, get } from 'lodash';
import moment from 'moment';
import { Route, withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import { InlineLoader } from '../../../../../theme/shared';
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
    indexName: '',
  };

  constructor(props) {
    super(props);
    this.props.elasticSearchStore.getESAudit();
  }

  elasticSearchHandler = (alias, module, indexName) => {
    this.cancelConfirmModal();
    if (module === 'AUDIT') {
      this.props.history.push(`${this.props.match.url}/${alias}`);
    } else {
      this.props.elasticSearchStore.elasticSearchHandler(alias, module, indexName);
    }
  }

  toggleConfirmModal = (alias, title, module, indexName) => {
    this.setState({
      confirmModal: true, alias, title, module, indexName,
    });
  }

  cancelConfirmModal = () => {
    this.setState({
      confirmModal: false, alias: null, title: '', module: '', indexName: '',
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
      <>
        <Grid>
          <Grid.Column width={5}>
            {eSAudit.length
              ? map(eSAudit, es => (
                <Card fluid className="elastic-search">
                  <Card.Content>
                    <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `Audit ${this.renderTitle(es.alias)} Indices`, 'AUDIT')} loading={inProgress === `${es.alias}_AUDIT`} content="Audit" primary />
                    <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `Swap ${this.renderTitle(es.alias)} Indices`, 'SWAP')} loading={inProgress === `${es.alias}_SWAP`} content="Swap" color="blue" />
                    <Header as="h5" className="mt-half">{`${this.renderTitle(es.alias)} Indices`}</Header>
                  </Card.Content>
                  <Card.Content>
                    {map(['index_a', 'index_b'], e => (
                      <Header as="h5">
                        {get(es, 'active') === get(es[e], 'indexName')
                          ? <Button floated="right" compact disabled content="Primary" />
                          : (
                            <>
                              <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `Populate ${this.renderTitle(es.alias)} Indices`, 'POPULATE', get(es[e], 'indexName'))} loading={inProgress === `${es.alias}_POPULATE`} content="Generate" color="blue" />
                              <Button floated="right" compact onClick={() => this.toggleConfirmModal(es.alias, `Delete ${this.renderTitle(es.alias)} Indices`, 'DELETE', get(es[e], 'indexName'))} loading={inProgress === `${es.alias}_DELETE`} content="Delete" color="red" />
                            </>
                          )
                      }
                      {this.renderTitle(get(es[e], 'indexName'))}
                      <Header.Subheader>{get(es[e], 'created.date') ? moment(get(es[e], 'created.date')).fromNow() : ''}</Header.Subheader>
                    </Header>
                    ))}
                </Card.Content>
              </Card>
              )) : <InlineLoader text="No Data Found" />
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
            onConfirm={() => this.elasticSearchHandler(this.state.alias, this.state.module, this.state.indexName)}
            size="mini"
            className="deletion"
          />
        </Grid>
        <Route exact path={`${match.url}/:auditAlias`} component={EsAudit} />
      </>
    );
  }
}
