import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Icon, Button, Confirm } from 'semantic-ui-react';
import { SortableContainer, SortableElement, arrayMove, sortableHandle } from 'react-sortable-hoc';
import { InlineLoader, NsPagination, UserAvatar } from './../../../../../theme/shared';

const DragHandle = sortableHandle(() => <Icon className="ns-drag-holder-large mr-10" />);
const SortableItem = SortableElement(({
  teamMember, handleAction, handleEdit, save, refUrl,
}) => (
  <div className="row-wrap striped-table">
    <div className="balance-half first-column">
      <DragHandle />
      <div className="mr-10">
        <UserAvatar
          UserInfo={{
            avatarUrl: teamMember.avatar ? teamMember.avatar : '',
            name: teamMember.memberName ? teamMember.memberName : '',
          }}
          size="nosize"
          base64url
        />
      </div>
      <Link to={`${refUrl}/${teamMember.id}`}>{teamMember.memberName}</Link>
    </div>
    <div className="balance">
      {teamMember.title}
    </div>
    <div className="balance-half">
      {teamMember && teamMember.social ?
        teamMember.social.map(site => (
          <Aux>
            {site.url &&
              <a target="_blank" rel="noopener noreferrer" href={site.url.includes('http') ? site.url : `http://${site.url}`}><Icon disabled name={site.type.toLowerCase()} /></a>
            }
          </Aux>
        )) : ''}
    </div>
    <div className="balance width-70 center-align">
      {teamMember.order}
    </div>
    <div className="action width-130 right-align">
      <Button.Group>
        <Button icon className="link-button" >
          <Icon className="ns-pencil" onClick={() => handleEdit(teamMember.id)} />
        </Button>
        <Button className="link-button">
          <Icon onClick={() => save(teamMember)} color="blue" name={teamMember.isPublished ? 'ns-view' : 'ns-no-view'} />
        </Button>
        <Button icon className="link-button" >
          <Icon className="ns-trash" onClick={() => handleAction(teamMember.id)} />
        </Button>
      </Button.Group>
    </div>
  </div>
));

const SortableList = SortableContainer(({
  teamMembers, handleAction, handleEdit, save, refUrl,
}) => (
  <div className="tbody">
    {teamMembers.map((teamMember, index) => (
      <SortableItem
        // eslint-disable-next-line react/no-array-index-key
        key={`item-${index}`}
        docIndx={index}
        teamMember={teamMember}
        save={save}
        handleAction={handleAction}
        handleEdit={handleEdit}
        index={index}
        refUrl={refUrl}
      />
    ))}
  </div>
));

@inject('teamStore', 'uiStore')
@withRouter
@observer
export default class AllTeam extends Component {
  componentWillMount() {
    this.props.teamStore.initRequest(true);
  }
  componentWillUnmount() {
    this.props.teamStore.reset();
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    const { teamMembers, setTeamMemberOrder } = this.props.teamStore;
    if (oldIndex !== newIndex) {
      setTeamMemberOrder(arrayMove(teamMembers, oldIndex, newIndex));
    }
  }
  deleteTeamMember = () => {
    this.props.teamStore.deleteTeamMemberById(this.props.teamStore.confirmBox.refId).then(() => {
      this.props.teamStore.setConfirmBox('');
      this.props.history.replace(this.props.refLink);
    });
  }
  handleAction = (id) => {
    this.props.teamStore.setConfirmBox('Delete', id);
  }
  handleDeleteCancel = () => {
    this.props.teamStore.setConfirmBox('');
  }
  paginate = params => this.props.teamStore.pageRequest(params);

  handleEdit = (id) => {
    const { match } = this.props;
    this.props.history.push(`${match.url}/${id}`);
  }
  save = (teamMember) => {
    this.props.teamStore.save(teamMember.id, teamMember);
    this.props.history.push(this.props.refLink);
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
    const { inProgress } = this.props.uiStore;
    if (loading || inProgress) {
      return <InlineLoader />;
    }
    if (teamMembers.length === 0) {
      return <InlineLoader text="No data found." />;
    }
    return (
      <Aux>
        <div className="ui card fluid">
          <div className="ui basic table">
            <div className="row-wrap striped-table thead">
              <div className="balance-half first-column">Name</div>
              <div className="balance">Postion</div>
              <div className="balance-half">Links</div>
              <div className="balance width-70 center-align">Order</div>
              <div className="action width-130 right-align" />
            </div>
            <SortableList
              teamMembers={teamMembers}
              pressDelay={100}
              openModal={this.openModal}
              save={this.save}
              handleEdit={this.handleEdit}
              handleAction={this.handleAction}
              onSortEnd={e => this.onSortEnd(e)}
              handleDeleteConfirm={this.handleDeleteConfirm}
              lockAxis="y"
              refUrl={this.props.match.url}
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
