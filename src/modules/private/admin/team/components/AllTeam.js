/* eslint-disable */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Card, Table, Icon, Grid, Button, Form, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader, NsPagination, UserAvatar } from './../../../../../theme/shared';
import { ByKeyword } from '../../../../../theme/form/Filters';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({ teamMember, handleAction, handleEdit }) => {
  return (
    <div className="row-wrap">
      <div className="balance-half">
        <DragHandle />
        <UserAvatar
          UserInfo={{
            avatarUrl: teamMember.avatar ? teamMember.avatar : '',
            name: teamMember.memberName ? teamMember.memberName : '',
          }}
          size="mini"
          base64url
        />
        {teamMember.memberName}
      </div>
      <div className="balance-half">
        {teamMember.title}
      </div>
      <div className="balance-half">
        {teamMember && teamMember.social ?
          teamMember.social.map(site => (
            <Aux>
              {site.url &&
                <a target="_blank" rel="noopener noreferrer" href={site.url}><Icon disabled name={site.type.toLowerCase()} /></a>
              }
            </Aux>
          )) : ''}
      </div>
      <div className="balance-half">
        {teamMember.order}
      </div>
      <div className="action right-align">
      <Button.Group>
        <Button icon className="link-button" >
          <Icon className="ns-pencil" onClick={() => handleEdit(teamMember.id)} />
        </Button>
        <Button className="link-button">
          <Icon color="blue" name="ns-view" />
        </Button>
        <Button icon className="link-button" >
          <Icon className="ns-trash" onClick={() => handleAction(teamMember.id)} />
        </Button>
      </Button.Group>
      </div>
    </div>
  );
});

const SortableList = SortableContainer(({ teamMembers, handleAction, handleEdit }) => {
  return (
    <div className="tbody">
      {teamMembers.map((teamMember, index) => (
        <SortableItem
          key={`item-${index}`}
          docIndx={index}
          teamMember={teamMember}
          handleAction={handleAction}
          handleEdit={handleEdit}
          index={index}
        />
      ))}
    </div>
  );
});

@inject('teamStore')
@withRouter
@observer
export default class AllTeam extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest(true);
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { teamMembers, setTeamMemberOrder } = this.props.teamStore;
    if (oldIndex !== newIndex) {
      setTeamMemberOrder(arrayMove(teamMembers, oldIndex, newIndex));
    }
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
        <div className="ui card fluid">
          <div className="ui basic table team-table striped">
            <div className="row-wrap thead">
              <div className="balance-half">Name</div>
              <div className="balance-half">Postion</div>
              <div className="balance-half">Links</div>
              <div className="balance-half">Order</div>
              <div className="action right-align"></div>
            </div>
            <SortableList
              teamMembers={teamMembers}
              pressDelay={100}
              openModal={this.openModal}
              publishStatus={this.publishStatus}
              handleEdit={this.handleEdit}
              handleAction={this.handleAction}
              onSortEnd={e => this.onSortEnd(e)}
              handleDeleteConfirm={this.handleDeleteConfirm}
              lockAxis="y"
              useDragHandle
            />
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
        </div>
      </Aux>
    );
  }
}
