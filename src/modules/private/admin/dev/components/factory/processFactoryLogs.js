import React, { useEffect, useState } from 'react';
import beautify from 'json-beautify';
import { Card, Table, Header, Modal } from 'semantic-ui-react';
import { isEmpty } from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Filters from './processFilter';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';
import { DataFormatter } from '../../../../../../helper';

const metaInfo = {
  store: 'factoryStore',
  form: 'PROCESSFACTORY_LOG_FRM',
};

function ProcessFactoryLogs(props) {
  const [respPayload, setRespPayload] = useState({});
  const [payloadHeader, setPayloadHeader] = useState('Response Payload');
  const [prev, setPrev] = useState(false);

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

  const showModel = (e, payload, headerTitle, VisibilityVal) => {
    e.preventDefault();
    setPayloadHeader(headerTitle);
    const payloadToDisply = typeof (payload) === 'string' ? JSON.parse(payload) : payload;
    setRespPayload(payloadToDisply);
    setPrev(VisibilityVal);
  };

  const handleCloseModel = (e, val) => {
    e.preventDefault();
    setPrev(val);
    setPayloadHeader('Response Payload');
    setRespPayload({});
  };

  const { loadingArray } = props.nsUiStore;
  const { factoryStore } = props;
  const {
    PROCESSFACTORY_LOG_FRM, requestState, filters, requestCount, requestLogs,
  } = factoryStore;
  const totalRecords = requestCount || 0;
  return (
    <>
    <Modal open={prev} size="small" closeOnDimmerClick={false} closeIcon onClose={e => handleCloseModel(e, false)}>
        <Modal.Content>
          <Header as="h3">{payloadHeader}</Header>
          {respPayload && !isEmpty(respPayload)
            ? (
              <pre className="no-updates bg-offwhite padded json-text">
                {beautify(respPayload, null, 2, 100)}
              </pre>
            )
            : (
              <section className="bg-offwhite mb-20 center-align">
                <Header as="h5">No Response Available.</Header>
              </section>
            )
          }
        </Modal.Content>
      </Modal>
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
                        <Table.HeaderCell width={3}>Job Id</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Trigger Date</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Status</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Payload</Table.HeaderCell>
                        <Table.HeaderCell width={3}>Completed Payload</Table.HeaderCell>
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
                                <Header as="h6">{DataFormatter.getDateAsPerTimeZone(resp.triggeredDate, true, false, false)}</Header>
                              </Table.Cell>
                              <Table.Cell singleLine>
                                <Header as="h6">{resp.status}</Header>
                              </Table.Cell>
                              <Table.Cell singleLine>
                                <Header as="h6"><Link to="/" onClick={e => showModel(e, resp.payload, 'Payload', true)} className="action">view Payload</Link></Header>
                              </Table.Cell>
                              <Table.Cell singleLine>
                                <Header as="h6"><Link to="/" onClick={e => showModel(e, resp.completePayload, 'Completed Payload', true)} className="action">view Completed Payload</Link></Header>
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
      </>
  );
}

export default inject('nsUiStore')(withRouter(formHOC(observer(ProcessFactoryLogs), metaInfo)));
