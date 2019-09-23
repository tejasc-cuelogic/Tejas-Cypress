import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Container, Header, Table, Card, Visibility, Item, Modal, Button, Icon, Popup } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import { DataFormatter } from '../../../../../../helper';

@inject('userDetailsStore')
@observer
export default class UserEmailList extends Component {
  constructor(props) {
    super(props);
    this.props.userDetailsStore.getEmailList();
  }

  state = { open: false }

  handleModel = (e, indexId) => {
    e.preventDefault();
    this.props.userDetailsStore.setFieldValue('emailListIndex', indexId);
    this.setState({ open: true });
  }

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({ open: false });
  }


  render() {
    const { userEmals, emailListOutputLoading, emailListIndex } = this.props.userDetailsStore;
    return (
      <>
        <Modal open={this.state.open} closeOnDimmerClick size="small" closeIcon onClose={e => this.handleCancel(e)}>
          <Modal.Content className="center-align">
            <Header as="h3">Email Content</Header>
            {userEmals && userEmals[emailListIndex].emailContent
              ? <p>{userEmals[emailListIndex].emailContent}</p>
              : (
                <section className="bg-offwhite mb-20">
                  <Header as="h5">Content not exists.</Header>
                </section>
              )
            }
            <div className="center-align">
              <Button.Group widths="2" className="inline">
                <Button primary content="Back" onClick={this.handleCancel} />
              </Button.Group>
            </div>
          </Modal.Content>
        </Modal>
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
                        userEmals && userEmals.map((resp, idx) => (
                            <Table.Row>
                              <Table.Cell>
                                <Popup
                                  trigger={(<span>{DataFormatter.getDateAsPerTimeZone(resp.requestDate, true, false, false)}</span>)}
                                  content={(
                                    <Item>
                                      {(resp.mergeVars === null) || (resp.mergeVars && resp.mergeVars.length <= 0) ? 'NA'
                                        : resp.mergeVars.map(mergDetails => (
                                          <Item.Content>
                                            <b>Name: </b>{mergDetails.name ? mergDetails.name : 'N/A'}
                                            <br />
                                            <b>Content: </b>{mergDetails.content ? mergDetails.content : 'N/A'}
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
                                {resp.subject} <span><Link onClick={e => this.handleModel(e, idx)} to="/"> (Body)</Link></span> {' '}
                                {((resp.attachments === null) || (resp.attachments && resp.attachments.length <= 0)) && (
<Popup
  trigger={<Icon className="ns-attachment" color="blue" size="large" />}
  content={(
                                    <Item>
                                      {(resp.attachments === null) || (resp.attachments && resp.attachments.length <= 0) ? 'NA'
                                        : resp.attachments.map(attach => (
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
