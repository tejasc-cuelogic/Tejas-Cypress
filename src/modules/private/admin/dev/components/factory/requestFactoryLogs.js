import React, { useEffect } from 'react';
import { Card, Table, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './requestFilters';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';
import { DataFormatter } from '../../../../../../helper';

const metaInfo = {
  store: 'factoryStore',
  form: 'REQUESTFACTORY_LOG_FRM',
};

function RequestFactoryLogs(props) {
  useEffect(() => {
    props.factoryStore.resetForm('REQUESTFACTORY_LOG_FRM');
    props.factoryStore.setFieldValue('inProgress', false, 'requestLogFactory');
    return () => {
      props.factoryStore.resetFilters();
      props.factoryStore.setFieldValue('requestLogList', []);
    };
  }, []);

  const change = (date, field) => {
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || date.value === '') {
      props.factoryStore.setInitiateSrch(field, date);
    }
  };

  const setSearchParam = (e, { name, value }) => props.factoryStore.setInitiateSrch(name, value);

  const paginate = params => props.factoryStore.initRequest(params);

  const { loadingArray } = props.nsUiStore;
  const { factoryStore } = props;
  const {
    REQUESTFACTORY_LOG_FRM, requestState, filters, requestCount, requestLogs,
  } = factoryStore;
  const totalRecords = requestCount || 0;
  return (
    <Card fluid className="elastic-search">
      <Card.Content header="Manage Request Factory" />
      <Card.Content>
        <Card.Description>
          <Filters
            requestState={requestState}
            filters={filters}
            setSearchParam={setSearchParam}
            change={change}
            paginate={paginate}
            totalRecords={totalRecords}
            FILTER_FRM={REQUESTFACTORY_LOG_FRM}
          />
          {loadingArray.includes('fetchRequestFactoryLogs') ? <InlineLoader />
            : (
              <div className="table-wrapper">
                <Table unstackable striped className="application-list">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Plugin</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Status</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Invocation Type</Table.HeaderCell>
                      <Table.HeaderCell width={4}>triggeredDate</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {!requestLogs || (requestLogs && requestLogs.length === 0) ? (
                      <Table.Row><Table.Cell textAlign="center" colSpan="7">No Logs Found.</Table.Cell></Table.Row>
                    ) : (
                      requestLogs && requestLogs.map(resp => (
                          <Table.Row verticalAlign="top">
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.plugin}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.status}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.invocationType}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{DataFormatter.getDateAsPerTimeZone(resp.triggeredDate, true, false, false)}</Header>
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

export default inject('nsUiStore')(withRouter(formHOC(observer(RequestFactoryLogs), metaInfo)));
