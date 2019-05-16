/*  eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Grid, Card, Form, Button, Item, Confirm } from 'semantic-ui-react';
import { FormInput, FormTextarea, DropZoneConfirm as DropZone } from '../../../../../theme/form';
import { InlineLoader, UserAvatar } from '../../../../../theme/shared';

@inject('teamStore')
@withRouter
@observer
export default class TeamDetails extends Component {
  state = {
    displayOnly: true,
  }
  componentWillMount() {
    const { match, teamStore } = this.props;
    const { id } = match.params;
    const { editMode } = teamStore;
    if (id !== 'new' && !editMode) {
      this.props.teamStore.getOne(id);
    }
  }
  onFileDrop = (files, name) => {
    this.props.teamStore.uploadFileToS3('TEAM_FRM', name, files);
  }

  handleDelDoc = (field) => {
    this.props.teamStore.removeUploadedDataMultiple('TEAM_FRM', field);
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  };
  save = () => {
    this.props.teamStore.save(this.props.match.params.id);
    this.props.history.push(this.props.refLink);
  }
  toogleField = () => {
    this.setState({ displayOnly: !this.state.displayOnly });
  }
  deleteTeamMember = () => {
    this.props.teamStore.deleteTeamMemberById(this.props.teamStore.confirmBox.refId);
    this.props.teamStore.setConfirmBox('');
    this.props.history.push(this.props.refLink);
  }
  handleAction = () => {
    this.props.teamStore.setConfirmBox('Delete', this.props.match.params.id);
  }
  handleDeleteCancel = () => {
    this.props.teamStore.setConfirmBox('');
  }
  render() {
    const {
      loading,
      TEAM_FRM,
      formChange,
      confirmBox,
    } = this.props.teamStore;
    const formName = 'TEAM_FRM';
    const formFields = ['title', 'memberName', 'order'];
    // const STATUS = [
    //   { key: 'DRAFT', value: 'DRAFT', text: 'DRAFT' },
    //   { key: 'LIVE', value: 'LIVE', text: 'LIVE' },
    // ];

    if (loading) {
      return <InlineLoader />;
    }
    return (
      <Modal closeOnDimmerClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Item.Group>
            <Item className="user-intro">
              <Item.Content verticalAlign="middle">
                <Header as="h3">
                  <Header.Subheader>Team Member Name</Header.Subheader>
                  {TEAM_FRM.fields.memberName.value}
                </Header>
                <Button.Group floated="right">
                  {this.props.match.params.id !== 'new' ?
                    <Button color="red" className="relaxed" content="Delete" onClick={() => this.handleAction()} />
                    : ''
                  }
                  <Button color="green" className="relaxed" content="Save" disabled={!TEAM_FRM.meta.isValid} onClick={this.save} />
                </Button.Group>
              </Item.Content>
            </Item>
          </Item.Group>
          <Grid>
            <Grid.Row>
              <Grid.Column width={11}>
                <Card fluid className="form-card full-height">
                  <Form className="story-form">
                    <Header as="h4">My Story</Header>
                    <FormTextarea
                      name="story"
                      fielddata={TEAM_FRM.fields.story}
                      containerclassname="secondary"
                      changed={(e, result) => formChange(e, result, formName)}
                    />
                  </Form>
                </Card>
              </Grid.Column>
              <Grid.Column width={5}>
                <Card fluid className="form-card">
                  <Header as="h4">Team Member&apos;s details</Header>
                  <Form>
                    {formFields.map(field => (
                      <FormInput
                        name={field}
                        key={TEAM_FRM.fields[field]}
                        fielddata={TEAM_FRM.fields[field]}
                        changed={(e, result) => formChange(e, result, formName)}
                      />
                    ))
                    }
                    {/* <FormDropDown
                      name="status"
                      fielddata={TEAM_FRM.fields.status}
                      options={STATUS}
                      selection
                      fluid
                      containerclassname="dropdown-field"
                      onChange={(e, res) => userEleChange(e, res, 'dropdown')}
                    /> */}
                  </Form>
                </Card>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={11}>
                <Card fluid className="form-card">
                  <Form>
                    <Header as="h4">Website & Social Profiles</Header>
                    <Form.Group widths={2}>
                      {
                        ['facebook', 'twitter', 'linkedin', 'instagram'].map(field => (
                          <FormInput
                            key={field}
                            name={field}
                            fielddata={TEAM_FRM.fields[field]}
                            changed={(e, result) => formChange(e, result, formName)}
                          />
                        ))
                      }
                    </Form.Group>
                  </Form>
                </Card>
              </Grid.Column>
              <Grid.Column width={5}>
                <Card fluid className="form-card full-height">
                  <Form>
                    <div className="inline field">
                      <label>Avatar</label>
                      <div className="team-avatar-wrap">
                        <UserAvatar
                          className="large"
                          UserInfo={{
                            name: TEAM_FRM.fields.memberName.value,
                            avatarUrl: TEAM_FRM.fields.avatar.preSignedUrl,
                            roles: [],
                          }}
                          base64url
                        />
                        <Button circular compact primary size="tiny" as={Link} to={`${this.props.match.url}/update-profile-photo`} icon={{ className: 'ns-pencil' }} />
                      </div>
                    </div>
                    <DropZone
                      name="heroImage"
                      fielddata={TEAM_FRM.fields.heroImage}
                      ondrop={(files, name) => this.onFileDrop(files, name)}
                      onremove={field => this.handleDelDoc(field)}
                      uploadtitle="Upload"
                    />
                  </Form>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Confirm
          header="Confirm"
          content="Are you sure you want to delete this team member?"
          open={confirmBox.entity === 'Delete'}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.deleteTeamMember}
          size="mini"
          className="deletion"
        />
      </Modal>
    );
  }
}
