import React, { useEffect } from 'react';
import { Card, Table, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import Filters from './processFilter';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'factoryStore',
  form: 'PROCESSFACTORY_LOG_FRM',
};

function ProcessFactoryLogs(props) {
  useEffect(() => {
    props.factoryStore.resetForm('PROCESSFACTORY_LOG_FRM');
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
    PROCESSFACTORY_LOG_FRM, requestState, filters, requestCount, requestLogs,
  } = factoryStore;
  const totalRecords = requestCount || 0;
  return (
    <Card fluid className="elastic-search">
      <Card.Content header="Manage Process Factory" />
      <Card.Content>
        <Card.Description>
          <Filters
            requestState={requestState}
            filters={filters}
            setSearchParam={setSearchParam}
            change={change}
            paginate={paginate}
            totalRecords={totalRecords}
            FILTER_FRM={PROCESSFACTORY_LOG_FRM}
          />
          {loadingArray.includes('fetchProcessLogs') ? <InlineLoader />
            : (
              <div className="table-wrapper">
                <Table unstackable striped className="application-list">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Job Id</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Type</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Status</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Result</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {!requestLogs || (requestLogs && requestLogs.length === 0) ? (
                      <Table.Row><Table.Cell textAlign="center" colSpan="7">No Logs Found.</Table.Cell></Table.Row>
                    ) : (
                      requestLogs && requestLogs.map(resp => (
                          <Table.Row verticalAlign="top">
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.jobId}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.type}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.status}</Header>
                            </Table.Cell>
                            <Table.Cell singleLine>
                              <Header as="h6">{resp.result}</Header>
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

export default inject('nsUiStore')(withRouter(formHOC(observer(ProcessFactoryLogs), metaInfo)));
