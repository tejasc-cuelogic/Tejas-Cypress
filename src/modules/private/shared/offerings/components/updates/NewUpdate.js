import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form, List, Icon, Confirm, Button, Checkbox } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormInput, FormRadioGroup } from '../../../../../../theme/form';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import MaskedInput from '../../../../../../theme/form/src/MaskedInput';
import ActivityHistory from '../../../ActivityHistory';
import { InlineLoader, Image64, UserAvatar } from '../../../../../../theme/shared';
import Actions from './Actions';
import Status from './Status';
import Helper from '../../../../../../helper/utility';

@inject('updateStore', 'userStore', 'offeringsStore', 'uiStore', 'userDetailsStore')
@withRouter
@observer
export default class NewUpdate extends Component {
  state = {
    editForm: false,
    confirmModal: false,
  }

  componentWillMount() {
    this.initiateFlow(this.props.match.params.id);
    this.props.updateStore.setFieldValue('newUpdateId', null);
  }

  initiateFlow = (id) => {
    if (id !== 'new') {
      this.props.updateStore.getOne(id);
    } else {
      this.props.updateStore.reset();
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.updateStore.setFieldValue('newUpdateId', null);
    this.props.history.replace(this.props.refLink);
  };

  showConfirmModal = () => {
    this.setState({ confirmModal: true });
  }

  toggleConfirmModal = () => {
    this.setState({ confirmModal: false });
  }

  deleteUpdate = () => {
    this.props.updateStore.deleteOfferingUpdates(this.props.match.params.id || this.props.updateStore.newUpdateId)
      .then(() => {
        this.props.history.push(this.props.refLink);
      });
  }

  save = (id, status) => {
    this.props.updateStore.save(id, status)
      .then(() => {
        if (status !== 'DRAFT') {
          this.props.updateStore.setFieldValue('newUpdateId', null);
          this.props.history.push(this.props.refLink);
        } else {
          this.props.history.push(`${this.props.refLink}/edit/${this.props.match.params.id || this.props.updateStore.newUpdateId}`);
        }
      })
      .catch(() => {
        Helper.toast('Something went wrong');
      });
  }

  edit = () => {
    this.setState({ editForm: true });
  }

  render() {
    const {
      PBUILDER_FRM, UpdateChange, FChange, maskChange, selectTemplate,
      loadingCurrentUpdate, sendTestEmail, TEMPLATE_FRM, currentUpdate,
    } = this.props.updateStore;
    const isNew = this.props.match.params.action === 'new';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const isReadonly = !isManager && (this.props.status === 'PENDING' || this.props.status === 'PUBLISHED');
    const { inProgress, loaderMessage } = this.props.uiStore;
    const { id } = this.props.match.params;
    const companyAvatarUrl = get(offer, 'media.avatar.url') || '';
    const { userDetails } = this.props.userDetailsStore;
    const userInfo = !isNew || isManager ? { firstName: userDetails.info.firstName, lastName: userDetails.info.lastName, avatarUrl: userDetails.info.avatar.url } : '';
    if (loadingCurrentUpdate || inProgress) {
      return <InlineLoader />;
    }
    return (
      <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Header as="h3">
            {isNew ? 'New' : 'Edit'}
            {' '}
  Update
            {!isNew
              && <Status status={PBUILDER_FRM.fields.status.value} />
            }
            <Actions
              save={this.save}
              meta={PBUILDER_FRM.meta}
              isManager={isManager}
              isDraft={PBUILDER_FRM.fields.status.value === 'DRAFT'}
              isPending={PBUILDER_FRM.fields.status.value === 'PENDING'}
              isPublished={PBUILDER_FRM.fields.status.value === 'PUBLISHED'}
              editForm={this.state.editForm}
              edit={this.edit}
              deleteUpdate={this.showConfirmModal}
              id={this.props.match.params.id}
              cancelUpdate={this.handleCloseModal}
            />
          </Header>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Form onSubmit={this.save}>
                  <FormInput
                    readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                    ishidelabel
                    fluid
                    type="text"
                    name="title"
                    fielddata={PBUILDER_FRM.fields.title}
                    changed={UpdateChange}
                  />
                  <HtmlEditor
                    readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                    changed={FChange}
                    name="content"
                    content={PBUILDER_FRM.fields.content.value}
                    overrides={{ heightMin: '70vh' }}
                  />
                </Form>
              </Grid.Column>
              <Grid.Column width={4}>
                <Card fluid>
                  <Card.Content>
                    <List relaxed>
                      <List.Item>
                        <Modal
                          closeOnDimmerClick={false}
                          closeIcon
                          trigger={(
                            <Button color="green" className="link-button">
                              <Icon className="ns-view" />
                                See the update
                            </Button>
                          )}
                        >
                          <Modal.Content>
                            <div className="ui image avatar-image">
                              {companyAvatarUrl && companyAvatarUrl.length
                                ? <Image64 srcUrl={companyAvatarUrl} circular />
                                : <UserAvatar UserInfo={userInfo} />
                              }
                              {!isNew && isManager ? get(currentUpdate, 'data.offeringUpdatesById.approved.by') : get(offer, 'keyTerms.shorthandBusinessName')}
                            </div>
                            <Header as="h4">{PBUILDER_FRM.fields.title.value}</Header>
                            <HtmlEditor readOnly content={(PBUILDER_FRM.fields.content.value || '')} />
                          </Modal.Content>
                        </Modal>
                      </List.Item>
                      <List.Item>
                        <Button color="green" className="link-button" disabled={isNew || loaderMessage} content={loaderMessage || 'Send test email to me'} onClick={() => sendTestEmail(this.props.match.params.id)} />
                      </List.Item>
                      {isManager
                        && (
                          <FormRadioGroup
                            readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                            fielddata={TEMPLATE_FRM.fields.type}
                            name="type"
                            changed={(e, result) => selectTemplate(e, result)}
                            widths="equal"
                            value={TEMPLATE_FRM.fields.type.value}
                          />
                        )
                      }
                    </List>
                  </Card.Content>
                </Card>
                {this.props.match.url.includes('engagement')
                  && (
                  <Card fluid>
                    <Card.Content>
                      <h4>Who’s this update for?</h4>
                      <Form.Group inline>
                        <FormRadioGroup
                          containerclassname={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly ? 'display-only' : ''}
                          readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                          fielddata={PBUILDER_FRM.fields.scope}
                          name="scope"
                          changed={UpdateChange}
                        />
                      </Form.Group>
                    </Card.Content>
                  </Card>
                  )
                }
                {['STARTUP_PERIOD', 'IN_REPAYMENT'].includes(offer.stage)
                  ? (
                  <>
                    <Card fluid>
                      <Card.Content>
                        <Header as="h4">Who’s this update for?</Header>
                        <FormRadioGroup
                          readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                          fielddata={PBUILDER_FRM.fields.scope}
                          name="scope"
                          changed={(e, result) => UpdateChange(e, result)}
                          widths="equal"
                          value={PBUILDER_FRM.fields.scope.value}
                        />
                        <Form>
                          {offer.rewardsTiers ? offer.rewardsTiers.map(rewardTier => (
                            <Form.Field key={rewardTier}>
                              <Checkbox
                                name="tiers"
                                readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                                value={rewardTier}
                                onChange={(e, result) => UpdateChange(e, result)}
                                checked={PBUILDER_FRM.fields.tiers.values.includes(rewardTier)}
                                label={`$${rewardTier}`}
                              />
                            </Form.Field>
                          )) : ''}
                        </Form>
                      </Card.Content>
                    </Card>
                    {isManager
                      && (
                        <Card fluid>
                          <Card.Content>
                            <Form>
                              <MaskedInput
                                readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                                ishidelabel
                                fluid
                                name="updatedDate"
                                fielddata={PBUILDER_FRM.fields.updatedDate}
                                changed={(values, name) => maskChange(values, 'PBUILDER_FRM', name)}
                                dateOfBirth
                              />
                            </Form>
                          </Card.Content>
                        </Card>
                      )}
                  </>
                  )
                  : (
                  <Card fluid>
                    <Card.Content>
                      <Header as="h4">NextSeed Tips</Header>
                      <List bulleted relaxed>
                        <List.Item>How is construction / build-out on your project going?</List.Item>
                        <List.Item>
                          Any potential hurdles you want to share with your investors?
                        </List.Item>
                        <List.Item>When do you anticipate opening? (e.g. Fall 2019)</List.Item>
                        <List.Item>What is the status on bonus rewards fulfillment?</List.Item>
                      </List>
                      <Link to="/"><b>Helpful Tips on Sending Updates</b></Link>
                    </Card.Content>
                  </Card>
                  )
              }
              </Grid.Column>
            </Grid.Row>
            {id && isManager
              && (
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Header as="h4">Acitivity History</Header>
                    <div className="sticky-sidebar">
                      <Card fluid>
                        <ActivityHistory showFilters={['activityType', 'activityUserType', 'ActivityDate']} resourceId={id} />
                      </Card>
                    </div>
                  </Grid.Column>
                </Grid.Row>
              )}
          </Grid>
          <Confirm
            header="Confirm"
            content="Are you sure you want to delete this Update ?"
            open={this.state.confirmModal}
            onCancel={this.toggleConfirmModal}
            onConfirm={this.deleteUpdate}
            size="mini"
            className="deletion"
          />
        </Modal.Content>
      </Modal>
    );
  }
}
