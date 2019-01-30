/* eslint-disable react/jsx-no-target-blank */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Card, Table, Icon, Grid, Button, Form, Confirm } from 'semantic-ui-react';
import { InlineLoader, UserAvatar, NsPagination } from './../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';

@inject('teamStore')
@withRouter
@observer
export default class AllTeam extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest(true);
  }
  deleteTeamMember = () => {
    this.props.teamStore.deleteTeamMemberById(this.props.teamStore.confirmBox.refId);
    this.props.teamStore.setConfirmBox('');
  }
  handleAction = (id) => {
    this.props.teamStore.setConfirmBox('Delete', id);
  }
  handleDeleteCancel = () => {
    this.props.teamStore.setConfirmBox('');
  }
  executeSearch = (e) => {
    this.props.teamStore.setInitiateSrch('keyword', e.target.value);
  }
  paginate = params => this.props.teamStore.pageRequest(params);
  handleAddNewMember = () => {
    const { match } = this.props;
    const redirectURL = `${match.url}/new`;
    this.props.teamStore.reset();
    this.props.history.push(redirectURL);
  }
  handleEdit = (id) => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/${id}`);
  }
  render() {
    const {
      teamMembers,
      loading,
      requestState,
      count,
      confirmBox,
    } = this.props.teamStore;
    const totalRecords = count || 0;
    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form>
          <Grid stackable className="bottom-aligned">
            <Grid.Row>
              <ByKeyword
                change={this.executeSearch}
                w={[11]}
                placeholder="Search by keyword or phrase"
                requestState={requestState}
                more="no"
                addon={
                  <Grid.Column width={5} textAlign="right">
                    {/*
                    <Button
                    color="green"
                    as={Link}
                    floated="right" to={`${match.url}/new`}> + Add new team member</Button>
                    */}
                    <Button color="green" onClick={this.handleAddNewMember} floated="right" > + Add new team member</Button>

                  </Grid.Column>
                }
              />
            </Grid.Row>
          </Grid>
        </Form>
        <Card fluid>
          <div className="table-wrapper">
            <Table unstackable striped sortable singleLine className="user-list">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Postion</Table.HeaderCell>
                  <Table.HeaderCell>Links</Table.HeaderCell>
                  <Table.HeaderCell>Order</Table.HeaderCell>
                  {/* <Table.HeaderCell>Status</Table.HeaderCell> */}
                  <Table.HeaderCell textAlign="right" />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {teamMembers.length === 0 ? (
                  <Table.Row><Table.Cell colSpan={5} textAlign="center">No Team Member to display !</Table.Cell></Table.Row>
                ) :
                  teamMembers.map(teamMember => (
                    <Table.Row key={teamMember.id}>
                      <Table.Cell>
                        <div className="user-image">
                          <UserAvatar
                            UserInfo={{
                              avatarUrl: teamMember.avatar ? teamMember.avatar : '',
                              name: teamMember.memberName ? teamMember.memberName : '',
                            }}
                            size="mini"
                            base64url
                          />
                          &nbsp;&nbsp;&nbsp;
                          {teamMember.memberName}
                        </div>
                      </Table.Cell>
                      <Table.Cell>{teamMember.title}</Table.Cell>
                      <Table.Cell>{teamMember.social ?
                        teamMember.social.map(site => (
                          <Aux>
                            {site.url &&
                              <a target="_blank" href={site.url}><Icon disabled name={site.type.toLowerCase()} /></a>
                            }
                          </Aux>
                        )) : ''}
                      </Table.Cell>
                      <Table.Cell>{teamMember.order}</Table.Cell>
                      {/* <Table.Cell>Status</Table.Cell> */}
                      <Table.Cell textAlign="right">
                        <Button.Group>
                          <Button icon className="link-button" >
                            <Icon className="ns-pencil" onClick={() => this.handleEdit(teamMember.id)} />
                          </Button>
                          <Button icon className="link-button" >
                            <Icon className="ns-trash" onClick={() => this.handleAction(teamMember.id)} />
                          </Button>
                        </Button.Group>
                      </Table.Cell>
                    </Table.Row>
                  ))
                }
              </Table.Body>
            </Table>
          </div>
          {totalRecords > 0 &&
            <NsPagination floated="right" initRequest={this.paginate} meta={{ totalRecords, requestState }} />
          }
          <Confirm
            header="Confirm"
            content="Are you sure you want to delete this team member?"
            open={confirmBox.entity === 'Delete'}
            onCancel={this.handleDeleteCancel}
            onConfirm={this.deleteTeamMember}
            size="mini"
            className="deletion"
          />
        </Card>
      </Aux>
    );
  }
}
