import React, { useEffect, useState } from 'react';
import { Card, Table, Item, Icon, Popup, Modal, Button, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import moment from 'moment';
import Filters from './filter';
import { InlineLoader } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';
import { DataFormatter } from '../../../../../../helper';

const metaInfo = {
  store: 'emailStore',
  form: 'EMAIL_LIST_FRM',
};

function EmailList(props) {
  const [index, setIndex] = useState(0);
  const [displyProp, setdisplyProp] = useState(false);

  useEffect(() => {
    props.emailStore.resetForm('EMAIL_LIST_FRM');
    return () => {
      props.emailStore.resetFilters();
    };
  }, []);

  const change = (date, field) => {
    if ((date && moment(date.formattedValue, 'MM-DD-YYYY', true).isValid()) || date.value === '') {
      props.emailStore.setInitiateSrch(field, date);
    }
  };

  const setSearchParam = (e, { name, value }) => props.emailStore.setInitiateSrch(name, value);

  const paginate = params => props.emailStore.initRequest(params);

  const handleModel = (e, indexId) => {
    e.preventDefault();
    setIndex(indexId);
    setdisplyProp(true);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setdisplyProp(false);
  };

  const { loadingArray } = props.nsUiStore;
  const { emailStore } = props;
  const {
    EMAIL_LIST_FRM, requestState, filters, count, emailList,
  } = emailStore;
  const totalRecords = count || 0;
  return (
    <>
      <Modal open={displyProp} closeOnDimmerClick size="small" closeIcon onClose={e => handleCancel(e)}>
        <Modal.Content className="center-align">
          <Header as="h3">Email Content</Header>
          {emailList && emailList.length > 0 && emailList[index].emailContent
            ? <p>{emailList[index].emailContent}</p>
            : (
              <section className="bg-offwhite mb-20">
                <Header as="h5">Content not exists.</Header>
              </section>
            )
          }
          <div className="center-align">
            <Button.Group widths="2" className="inline">
              <Button primary content="Back" onClick={handleCancel} />
            </Button.Group>
          </div>
        </Modal.Content>
      </Modal>
      <Card fluid className="elastic-search">
        <Card.Content header="Manage Email" />
        <Card.Content>
          <Card.Description>
            <Filters
              requestState={requestState}
              filters={filters}
              setSearchParam={setSearchParam}
              change={change}
              paginate={paginate}
              totalRecords={totalRecords}
              FILTER_FRM={EMAIL_LIST_FRM}
            />
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
                        <Table.Row><Table.Cell textAlign="center" colSpan="7">No emails to display.</Table.Cell></Table.Row>
                      ) : (
                        emailList && emailList.map((resp, idx) => (
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
                                <span className="user-name"><b>{resp.fromName ? resp.fromName : ''}</b></span>
                                {resp.fromEmail ? resp.fromEmail : ''}
                              </Table.Cell>
                              <Table.Cell className="user-status">
                                <span className="user-name"><b>{resp.toFirstName ? resp.toFirstName : ''}</b></span>
                                {resp.toEmail ? resp.toEmail : ''}
                              </Table.Cell>
                              <Table.Cell collapsing>
                                {resp.subject} <span><Link onClick={e => handleModel(e, idx)} to="/"> (Body)</Link></span> {' '}
                                {resp.attachments !== null && resp.attachments && resp.attachments.length > 0 && (
                                  <Popup
                                    trigger={<Icon className="ns-attachment" color="blue" size="large" />}
                                    content={(
                                      <Item>
                                        {resp.attachments.map(attach => (
                                          <Item.Content>
                                            <b>Name: </b>{attach.name ? attach.name : 'N/A'}
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
        </Card.Content>
      </Card>
    </>
  );
}

export default inject('nsUiStore')(withRouter(formHOC(observer(EmailList), metaInfo)));
