import React, { useEffect, useState } from 'react';
import { Card, Table, Item, Icon, Popup } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Filters from './filter';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';
import { DataFormatter } from '../../../../../../helper';
import EmailContent from '../../../../shared/EmailContent';

const metaInfo = {
  store: 'emailStore',
  form: 'EMAIL_LIST_FRM',
};

function EmailList(props) {
  const [displyRecord, setdisplyRecord] = useState(false);
  const [showContentModal, toggleModal] = useState(false);
  const [id, setId] = useState(false);
  const [requestDate, setRequestDate] = useState(false);

  useEffect(() => {
    props.emailStore.resetForm('EMAIL_LIST_FRM');
    return () => {
      props.emailStore.resetFilters();
      props.emailStore.setFieldValue('emailLogList', []);
      setdisplyRecord(false);
    };
  }, []);

  const change = (date, field) => {
    setdisplyRecord(true);
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || date.value === '') {
      props.emailStore.setInitiateSrch(field, date);
    }
  };

  const setSearchParam = (e, { name, value }) => {
    setdisplyRecord(true);
    props.emailStore.setInitiateSrch(name, value);
  };

  const paginate = params => props.emailStore.initRequest(params);

  const handleModel = (e, dataObj) => {
    e.preventDefault();
    setRequestDate(dataObj.requestDate);
    setId(dataObj.recipientId);
    toggleModal(true);
  };

  const handleCloseModal = () => {
    toggleModal(false);
  };

  const { loadingArray } = props.nsUiStore;
  const { emailStore } = props;
  const {
    EMAIL_LIST_FRM, requestState, filters, count, emailList,
  } = emailStore;
  const totalRecords = count || 0;
  return (
    <>
      {showContentModal && (
        <EmailContent
          id={id}
          requestDate={requestDate}
          handleCloseModal={handleCloseModal}
          showContentModal={showContentModal}
          {...props}
        />
      )
      }
      <Filters
        requestState={requestState}
        filters={filters}
        setSearchParam={setSearchParam}
        change={change}
        paginate={paginate}
        totalRecords={totalRecords}
        FILTER_FRM={EMAIL_LIST_FRM}
      />
      <Card fluid className="elastic-search">
        <Card.Description>
          {loadingArray.includes('getEmailList') ? <InlineLoader />
            : (
              <div className="table-wrapper">
                <Table unstackable striped className="application-list">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Send Date</Table.HeaderCell>
                      <Table.HeaderCell width={4}>From Details</Table.HeaderCell>
                      <Table.HeaderCell width={4}>To Details</Table.HeaderCell>
                      <Table.HeaderCell width={4}>Subject</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {!emailList || (emailList && emailList.length === 0) ? (
                      <Table.Row><Table.Cell textAlign="center" colSpan="7">{displyRecord && 'No emails to display.'}</Table.Cell></Table.Row>
                    ) : (
                      emailList && emailList.map(resp => (
                          <Table.Row>
                            <Table.Cell>
                              <Popup
                                trigger={(<span>{DataFormatter.getDateAsPerTimeZone(resp.requestDate, true, false, false)}</span>)}
                                content={(
                                  <Item>
                                    {(resp.mergeVars === null) || (resp.mergeVars && resp.mergeVars.length <= 0) ? 'NA'
                                      : resp.mergeVars.map(mergDetails => (
                                        <Item.Content>
                                          <b>{mergDetails.name}:</b>{' '} {mergDetails.content}
                                        </Item.Content>
                                      ))
                                    }
                                  </Item>
                                )}
                                hoverable
                              />
                            </Table.Cell>
                            <Table.Cell className="user-status">
                              <span className="user-name"><b>{resp.fromName}</b></span>
                              <p>{resp.fromEmail}</p>
                            </Table.Cell>
                            <Table.Cell className="user-status">
                              <span className="user-name"><b>{resp.toFirstName}</b></span>
                              <p>{resp.toEmail}</p>
                            </Table.Cell>
                            <Table.Cell collapsing>
                              {resp.subject} <span><Link className="highlight-text" onClick={e => handleModel(e, { recipientId: resp.recipientId, requestDate: resp.requestDate })} to="/">(Body)</Link></span> {' '}
                              {resp.attachments && resp.attachments.length > 0 && (
                                <Popup
                                  trigger={<Icon className="ns-attachment" color="blue" size="large" />}
                                  content={(
                                    <Item>
                                      {resp.attachments.map(attach => (
                                        <Item.Content>
                                          <b>Name: </b>{attach.name || 'N/A'}
                                        </Item.Content>
                                      ))
                                      }
                                    </Item>
                                  )}
                                  hoverable
                                  position="top center"
                                />
                              )}
                            </Table.Cell>
                          </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table>
              </div>
            )}
        </Card.Description>
      </Card>
    </>
  );
}

export default inject('nsUiStore')(withRouter(formHOC(observer(EmailList), metaInfo)));
