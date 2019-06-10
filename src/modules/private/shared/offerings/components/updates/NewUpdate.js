import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Divider, Grid, Card, Form, List, Icon, Confirm, Button, Checkbox } from 'semantic-ui-react';
import { FormInput, FormRadioGroup } from '../../../../../../theme/form';
import HtmlEditor from '../../../../../shared/HtmlEditor';
import { InlineLoader } from '../../../../../../theme/shared';
import Actions from './Actions';
import Status from './Status';

@inject('updateStore', 'userStore', 'offeringsStore')
@withRouter
@observer
export default class NewUpdate extends Component {
  state = {
    editForm: false,
    confirmModal: false,
  }
  componentWillMount() {
    this.initiateFlow(this.props.id);
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
    this.props.history.replace(this.props.refLink);
  };
  showConfirmModal = () => {
    this.setState({ confirmModal: true });
  }
  toggleConfirmModal = () => {
    this.setState({ confirmModal: false });
  }
  deleteUpdate = () => {
    this.props.updateStore.deleteOfferingUpdates(this.props.id);
    this.props.history.push(this.props.refLink);
  }

  save = (status) => {
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    this.props.updateStore.save(this.props.id, status, isManager, this.props.status === 'PUBLISHED');
    this.props.history.push(this.props.refLink);
  }
  edit = () => {
    this.setState({ editForm: true });
  }
  cancelUpdate = () => {
    this.props.history.push(this.props.refLink);
  }
  cancelChanges = () => {
    this.initiateFlow(this.props.id);
    this.setState({ editForm: false });
  }
  render() {
    const {
      PBUILDER_FRM, UpdateChange, FChange,
      loadingCurrentUpdate, sendTestEmail,
    } = this.props.updateStore;
    const { isIssuer } = this.props.userStore;
    const isNew = this.props.id === 'new';
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const { offer } = this.props.offeringsStore;
    // const isReadonly = ((submitted && !isManager) || (isManager && approved && approved.status));
    const isReadonly = !isManager && (this.props.status === 'PENDING' || this.props.status === 'PUBLISHED');
    if (loadingCurrentUpdate) {
      return <InlineLoader />;
    }
    return (
      <Modal.Content className="transaction-details">
        <Header as="h3">
          {isNew ? 'New' : 'Edit'} Update
          {!isNew &&
            <Status status={PBUILDER_FRM.fields.status.value} />
          }
          <Actions
            save={this.save}
            meta={PBUILDER_FRM.meta}
            isManager={isManager}
            isPending={this.props.status === 'PENDING'}
            isPublished={this.props.status === 'PUBLISHED'}
            editForm={this.state.editForm}
            edit={this.edit}
            deleteUpdate={this.showConfirmModal}
            id={this.props.id}
            cancelUpdate={this.cancelUpdate}
            cancelChanges={this.cancelChanges}
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
                        trigger={
                          <Button color="green" className="link-button"><Icon className="ns-view" />See the update</Button>
                        }
                      >
                        <Modal.Content>
                          <HtmlEditor readOnly content={(PBUILDER_FRM.fields.content.value || '')} />
                        </Modal.Content>
                      </Modal>
                    </List.Item>
                    <List.Item>
                      <Button color="green" className="link-button" disabled={isNew} content="Send test email to me" onClick={() => sendTestEmail(this.props.id)} />
                    </List.Item>
                  </List>
                </Card.Content>
              </Card>
              {this.props.match.url.includes('engagement') &&
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
              }
              {isIssuer && ['STARTUP_PERIOD', 'IN_REPAYMENT', 'LIVE'].includes(offer.stage) ?
                <Card fluid>
                  <Card.Content>
                    <Header as="h4">Who’s this update for?</Header>
                    <FormRadioGroup
                      fielddata={PBUILDER_FRM.fields.scope}
                      name="scope"
                      changed={(e, result) => UpdateChange(e, result)}
                      widths="equal"
                      value={PBUILDER_FRM.fields.scope.value}
                    />
                    <br />
                    {offer.rewardsTiers ? offer.rewardsTiers.map(rewardTier => (
                      <Checkbox
                        name="tiers"
                        value={rewardTier}
                        onChange={(e, result) => UpdateChange(e, result)}
                        checked={PBUILDER_FRM.fields.tiers.values.includes(rewardTier)}
                        label={`$${rewardTier}`}
                      />)) : ''}
                  </Card.Content>
                </Card>
              :
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
            }
            </Grid.Column>
          </Grid.Row>
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
    );
  }
}
