import React, { Component } from 'react';
import { Card, Table, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './cronFilters';
import { InlineLoader } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

@inject('factoryStore')
@withRouter
@observer
export default class CronFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.resetForm('CRONFACTORY_FRM');
    this.props.factoryStore.inProgress.cronFactory = false;
    // this.props.factoryStore.initRequest();
  }

  componentWillUnmount() {
    this.props.factoryStore.resetFilters();
  }

  onSubmit = () => {
    this.props.factoryStore.cronFactoryPluginTrigger();
  }

  change = (date, field) => {
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || date.value === '') {
      this.props.factoryStore.setInitiateSrch(field, date);
    }
  }

  executeSearch = (e) => {
    if (e.charCode === 13) {
      this.props.factoryStore.setInitiateSrch('jobId', e.target.value);
    }
  }

  setSearchParam = (e, { name, value }) => this.props.factoryStore.setInitiateSrch(name, value);

  toggleSearch = () => this.props.factoryStore.toggleSearch();

  paginate = params => this.props.factoryStore.initRequest(params);

  render() {
    const { factoryStore } = this.props;
    const {
      CRONFACTORY_FRM, requestState, filters, count, cronLogs, loading,
    } = factoryStore;
    const totalRecords = count || 0;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Manage Cron Factory" />
        <Card.Content>
          <Card.Description>
            <Filters
              requestState={requestState}
              filters={filters}
              setSearchParam={this.setSearchParam}
              executeSearch={this.executeSearch}
              change={this.change}
              paginate={this.paginate}
              totalRecords={totalRecords}
              FILTER_FRM={CRONFACTORY_FRM}
            />
            {loading ? <InlineLoader />
              : (
            <div className="table-wrapper">
              <Table unstackable striped className="application-list">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>JobId</Table.HeaderCell>
                    <Table.HeaderCell width={4}>Execute Status</Table.HeaderCell>
                    <Table.HeaderCell width={4}>Meta Type</Table.HeaderCell>
                    <Table.HeaderCell width={4}>Executed On</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {!cronLogs || (cronLogs && cronLogs.length === 0) ? (
                    <Table.Row><Table.Cell textAlign="center" colSpan="7">No Logs Fond.</Table.Cell></Table.Row>
                  ) : (
                    cronLogs && cronLogs.map(resp => (
                      <Table.Row verticalAlign="top">
                        <Table.Cell singleLine>
                          <Header as="h6">{resp.jobId}</Header>
                        </Table.Cell>
                        <Table.Cell singleLine>
                          <Header as="h6">{resp.execStatus}</Header>
                        </Table.Cell>
                        <Table.Cell singleLine>
                          <Header as="h6">{resp.cronMetaType}</Header>
                        </Table.Cell>
                        <Table.Cell singleLine>
                          <Header as="h6">{DataFormatter.getDateAsPerTimeZone(resp.execInitiatedOn, true, false, false)}</Header>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>
              )}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}