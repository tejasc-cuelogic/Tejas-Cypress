import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, Route } from 'react-router-dom';
import { Container, Header, Table, Card, Visibility, Item, Icon, Popup } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';
import EmailContent from '../../../../shared/EmailContent';

@inject('userDetailsStore')
@observer
export default class UserEmailList extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.getEmailList();
  }

  render() {
    const { userDetailsStore, match } = this.props;
    const { userEmals, emailListOutputLoading } = userDetailsStore;
    return (
      <>
        <Route
          path={`${match.url}/:id/:requestDate`}
          render={props => <EmailContent refLink={match.url} {...props} />
          }
        />
        {emailListOutputLoading ? <InlineLoader />
          : (
            <>
              <Header as="h4">Email List</Header>
              <Container as={!this.props.admin ? Card : false} fluid>
                <div className="table-wrapper">
                  <Table unstackable striped className="user-list email-list">
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Send Date</Table.HeaderCell>
                        <Table.HeaderCell>From Details</Table.HeaderCell>
                        <Table.HeaderCell>To Details</Table.HeaderCell>
                        <Table.HeaderCell>Subject</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Visibility
                      as="tbody"
                      continuous
                    >
                      {!userEmals || (userEmals && userEmals.length === 0) ? (
                        <Table.Row><Table.Cell textAlign="center" colSpan="7">No emails to display.</Table.Cell></Table.Row>
                      ) : (
                        userEmals && userEmals.map(resp => (
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
                                {resp.subject} <span><Link className="highlight-text" to={`${match.url}/${resp.recipientId}/${resp.requestDate}`}> (Body)</Link></span> {' '}
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
                      )
                      }
                    </Visibility>
                  </Table>
                </div>
              </Container>
            </>
          )}
      </>
    );
  }
}
