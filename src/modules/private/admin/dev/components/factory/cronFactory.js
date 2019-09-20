import React, { Component } from 'react';
import { Card, Table, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './cronFilters';

@inject('factoryStore')
@withRouter
@observer
export default class CronFactory extends Component {
  constructor(props) {
    super(props);
    this.props.factoryStore.resetForm('CRONFACTORY_FRM');
    this.props.factoryStore.inProgress.cronFactory = false;
    this.props.factoryStore.initRequest();
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
      CRONFACTORY_FRM, requestState, filters, count,
    } = factoryStore;
    const totalRecords = count || 0;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Manage Cron Factory" />
        <Card.Content>
          <Card.Description>
            {/* <Button icon color="blue" onClick={this.toggleSearch} className="link-button">
              {filters ? <>Hide Filters <Icon className="ns-caret-up" /></>
                : <>Show Filters <Icon className="ns-caret-down" /></>
              }
            </Button> */}
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
            <div className="table-wrapper">
              <Table unstackable className="application-list">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Info</Table.HeaderCell>
                    <Table.HeaderCell width={4}>Comments</Table.HeaderCell>
                    <Table.HeaderCell width={4}>Title</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {/* {getBusinessApplication.length
                  ? getBusinessApplication.map(application => (
                    (application.applicationStatus || application.prequalStatus)
                    !== BUSINESS_APPLICATION_STATUS.APPLICATION_REMOVED
                    && ( */}
                  <Table.Row verticalAlign="top">
                    <Table.Cell singleLine>
                      <Header as="h6">List Elment Header 1</Header>
                    </Table.Cell>
                    <Table.Cell singleLine>
                      <Header as="h6">List Elment Header 2</Header>
                    </Table.Cell>
                    <Table.Cell singleLine>
                      <Header as="h6">List Elment Header 3</Header>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
