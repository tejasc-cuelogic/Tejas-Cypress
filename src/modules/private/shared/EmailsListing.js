import React from 'react';
import { Link } from 'react-router-dom';
import { Table, Popup, Item, Icon } from 'semantic-ui-react';
import { DataFormatter } from '../../../helper';

const EmailsListing = ({ emailList, displyNoEmails, handleModel }) => (
    <div className="table-wrapper">
      <Table unstackable striped className="application-list">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Send Date</Table.HeaderCell>
            <Table.HeaderCell>From Details</Table.HeaderCell>
            <Table.HeaderCell>To Details</Table.HeaderCell>
            <Table.HeaderCell>Subject</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {!emailList || (emailList && emailList.length === 0) ? (
            <Table.Row><Table.Cell textAlign="center" colSpan="7">{displyNoEmails && 'No emails to display.'}</Table.Cell></Table.Row>
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
);

export default EmailsListing;
