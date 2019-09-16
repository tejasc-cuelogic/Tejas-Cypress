import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form, List, Icon, Confirm, Button, Checkbox } from 'semantic-ui-react';
import { get } from 'lodash';
import moment from 'moment';
import { FormInput, FormRadioGroup } from '../../../../../../theme/form';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import MaskedInput from '../../../../../../theme/form/src/MaskedInput';
import ActivityHistory from '../../../ActivityHistory';
import { InlineLoader, Image64, UserAvatar } from '../../../../../../theme/shared';
import Actions from './Actions';
import Status from './Status';
import Helper from '../../../../../../helper/utility';

@inject('updateStore', 'userStore', 'offeringsStore', 'uiStore')
@withRouter
@observer
export default class NewUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editForm: false,
      confirmModal: false,
      loading: true,
    };
    this.props.updateStore.setFieldValue('newUpdateId', null);
  }

  componentDidMount() {
    this.initiateFlow(this.props.match.params.action, this.props.match.params.id);
    this.setState({ loading: false });
  }

  initiateFlow = (action, id) => {
    if (action !== 'new' && id !== undefined) {
      this.setState({ loading: false });
      this.props.updateStore.getOne(id);
    } else {
      this.props.updateStore.reset();
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.updateStore.setFieldValue('newUpdateId', null);
    this.props.updateStore.setFieldValue('currentUpdate', {});
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

  sendTestEmail = (id, stage, status) => {
    const emailTemplate = ['STARTUP_PERIOD', 'IN_REPAYMENT'].includes(stage) ? 'FULL' : false;
    this.props.uiStore.setProgress();
    if (this.props.updateStore.PBUILDER_FRM.meta.isDirty) {
      this.props.updateStore.save(id, status, false, true).then((shouldSendInvestorNotifications) => {
        this.props.uiStore.setProgress();
        this.props.updateStore.sendTestEmail(id, emailTemplate, shouldSendInvestorNotifications);
      });
    } else {
      this.props.updateStore.sendTestEmail(id, emailTemplate);
    }
  }

  save = (id, status, redirectToListing = false, updateOnly = false) => {
    this.props.updateStore.save(id, status, true, updateOnly)
      .then(() => {
        if (redirectToListing) {
          this.props.updateStore.setFieldValue('newUpdateId', null);
          this.props.history.push(this.props.refLink);
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
      PBUILDER_FRM, UpdateChange, FChange, maskChange, selectTemplate, newUpdateId,
      loadingCurrentUpdate, TEMPLATE_FRM,
    } = this.props.updateStore;
    const isNew = this.props.match.params.action === 'new' && !newUpdateId;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    const isReadonly = !isManager && (this.props.status === 'PENDING' || this.props.status === 'PUBLISHED');
    const { inProgress, loaderMessage } = this.props.uiStore;
    const { id } = this.props.match.params;
    const companyAvatarUrl = get(offer, 'media.avatar.url') || '';
    const isDraft = PBUILDER_FRM.fields.status.value === 'DRAFT';
    const isPending = PBUILDER_FRM.fields.status.value === 'PENDING';
    const isPublished = PBUILDER_FRM.fields.status.value === 'PUBLISHED';
    if (loadingCurrentUpdate || this.state.loading) {
      return <InlineLoader />;
    }
    return (
      <Modal closeOnDimmerClick={false} closeOnRootNodeClick={false} closeOnEscape={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-details">
          <Header as="h3">
            {isNew ? 'New ' : 'Edit '} Update
            {!isNew
              && <Status status={PBUILDER_FRM.fields.status.value} />
            }
            <Actions
              save={this.save}
              meta={PBUILDER_FRM.meta}
              isManager={isManager}
              isDraft={isDraft}
              isPending={isPending}
              isPublished={isPublished}
              editForm={this.state.editForm}
              edit={this.edit}
              deleteUpdate={this.showConfirmModal}
              id={this.props.match.params.id || newUpdateId}
              cancelUpdate={this.handleCloseModal}
              inProgress={inProgress}
            />
          </Header>
          <Divider hidden />
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Form>
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
                    overrides={{ heightMin: '80vh', heightMax: '80vh' }}
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
                          <Modal.Content className="new-update-modal">
                            <Header>
                              <div className="ui image avatar-image">
                                {companyAvatarUrl && companyAvatarUrl.length
                                  ? <Image64 srcUrl={companyAvatarUrl} circular className="large" />
                                  : <UserAvatar UserInfo={{ name: get(offer, 'keyTerms.shorthandBusinessName'), avatarUrl: '' }} className="large" />
                                }
                              </div>
                              <Header.Content className="grey-header">
                                {get(offer, 'keyTerms.shorthandBusinessName')}
                                <Header.Subheader>{PBUILDER_FRM.fields.updatedDate.value ? moment(PBUILDER_FRM.fields.updatedDate.value).format('LL') : '-'}</Header.Subheader>
                                {/* <Header.Subheader>{moment().format('ll')}</Header.Subheader> */}
                              </Header.Content>
                            </Header>
                            <Header as="h4">{PBUILDER_FRM.fields.title.value}</Header>
                            <HtmlEditor readOnly content={(PBUILDER_FRM.fields.content.value || '')} />
                          </Modal.Content>
                        </Modal>
                      </List.Item>
                      {isManager && (
                      <List.Item>
                        <Button color="green" className="link-button" disabled={isNew || loaderMessage || inProgress} content={loaderMessage || 'Send test email to me'} onClick={() => this.sendTestEmail(this.props.match.params.id || this.props.updateStore.newUpdateId, offer.stage, isPublished ? 'PUBLISHED' : isPending ? 'PENDING' : 'DRAFT')} />
                     </List.Item>
                      )}
                    </List>
                  </Card.Content>
                </Card>
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
                          containerclassname="mb-10"
                          widths="equal"
                          value={PBUILDER_FRM.fields.scope.value}
                        />
                        <Form>
                          {PBUILDER_FRM.fields.scope.value !== 'PUBLIC'
                            ? (
                            <Form.Field>
                              <Checkbox
                                name="allInvestor"
                                readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                                onChange={(e, result) => UpdateChange(e, result)}
                                checked={PBUILDER_FRM.fields.allInvestor.value}
                                label="All Investors"
                              />
                            </Form.Field>
                            ) : null
                          }
                          {PBUILDER_FRM.fields.scope.value !== 'PUBLIC' && offer.earlyBird && offer.earlyBird.quantity > 0 ? (
                            <Form.Field>
                              <Checkbox
                                name="tiers"
                                readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                                value={-1}
                                onChange={(e, result) => UpdateChange(e, result)}
                                checked={PBUILDER_FRM.fields.tiers.values.includes(-1)}
                                label="Early Bird"
                              />
                            </Form.Field>
                          ) : ''}
                          {PBUILDER_FRM.fields.scope.value !== 'PUBLIC' && offer.rewardsTiers ? offer.rewardsTiers.map(rewardTier => (
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
                              <Form.Field>
                              <Checkbox
                                name="shouldSendInvestorNotifications"
                                onChange={(e, result) => UpdateChange(e, result)}
                                checked={PBUILDER_FRM.fields.shouldSendInvestorNotifications.value}
                                label="Send Notifications"
                              />
                            </Form.Field>
                            </Form>
                          </Card.Content>
                        </Card>
                      )}
                  </>
                  )
                  : (
                    <>
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
                                <Form.Field>
                                <Checkbox
                                  name="shouldSendInvestorNotifications"
                                  onChange={(e, result) => UpdateChange(e, result)}
                                  checked={PBUILDER_FRM.fields.shouldSendInvestorNotifications.value}
                                  label="Send Notifications"
                                />
                              </Form.Field>
                              {['LIVE', 'LOCK', 'PROCESSING'].includes(offer.stage)
                                && (
                                    <div className="field">
                                      <Header as="label">{TEMPLATE_FRM.fields.type.label}</Header>
                                      <FormRadioGroup
                                        readOnly={(this.props.status === 'PUBLISHED' && isManager) ? !this.state.editForm : isReadonly}
                                        fielddata={TEMPLATE_FRM.fields.type}
                                        name="type"
                                        changed={(e, result) => selectTemplate(e, result)}
                                        widths="equal"
                                        value={TEMPLATE_FRM.fields.type.value}
                                      />
                                    </div>
                                )
                              }
                            </Form>
                          </Card.Content>
                        </Card>
                      )}
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
                        </Card.Content>
                      </Card>
                    </>
                  )
              }
              {(id || newUpdateId) && (isManager || (!isManager && isDraft)) && (
              <Button
                inverted
                color="red"
                onClick={this.showConfirmModal}
                disabled={inProgress}
                content="Delete"
              />
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
