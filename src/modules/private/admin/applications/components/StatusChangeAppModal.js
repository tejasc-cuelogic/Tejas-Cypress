import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import { capitalize } from 'lodash';
import { FormTextarea } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { adminActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';

@inject('uiStore', 'businessAppReviewStore', 'businessAppStore')
@withRouter
@observer
export default class StatusChangeAppModal extends Component {
  componentWillMount() {
    // this.props.businessAppReviewStore.resetMe
    // ('APPLICATION_STATUS_COMMENT_FRM', 'APPLICATION_STATUS_COMMENT');
  }
  handleCloseModal = (e) => {
    e.preventDefault();
    this.props.uiStore.setErrors(null);
    this.props.history.goBack();
  }
  updateApplicationStatus = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    this.props.businessAppReviewStore
      .updateApplicationStatus(params.appId, params.userId, params.appStatus, params.action)
      .then(() => {
        this.props.uiStore.setErrors(null);
        this.props.history.goBack();
      });
  }
  promoteApplication = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    const appType = 'prequal-failed';
    this.props.businessAppStore.fetchAdminApplicationById(params.appId, appType, params.userId)
      .then((data) => {
        const prequalData = (data && data.businessApplicationsDetailsAdmin) || null;
        if (prequalData) {
          const userDetails = {
            givenName: prequalData.firstName,
            familyName: prequalData.lastName,
            email: prequalData.email,
            TemporaryPassword: 'nextseed',
            verifyPassword: 'nextseed',
            role: ['issuer'],
          };
          adminActions.createNewUser(userDetails).then(() => {
            this.props.businessAppReviewStore
              .updateApplicationStatus(
                params.appId,
                params.userId,
                params.appStatus,
                params.action,
              ).then(() => {
                this.props.uiStore.setErrors(null);
                this.props.history.goBack();
              });
          }).catch((err) => {
            if (err.message === 'An account with the given email already exists.') {
              this.props.businessAppReviewStore
                .updateApplicationStatus(
                  params.appId,
                  params.userId,
                  params.appStatus,
                  params.action,
                ).then(() => {
                  this.props.uiStore.setErrors(null);
                  this.props.history.goBack();
                });
            } else {
              Helper.toast('Something went wrong. Please try again after sometime', 'error');
            }
          });
        }
      });
  }
  render() {
    const { uiStore, businessAppReviewStore, match } = this.props;
    const { APPLICATION_STATUS_COMMENT_FRM, formChange } = businessAppReviewStore;
    const { fields } = APPLICATION_STATUS_COMMENT_FRM;
    const { inProgress } = uiStore;
    const { errors } = uiStore;
    const { params } = match;
    return (
      <Modal size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">{params.action === 'REMOVED' ? 'Remove' : capitalize(params.action)} Application?</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          {errors &&
            <Message error>
              <ListErrors errors={[errors]} />
            </Message>
          }
          <Form error>
            <Form.Group widths="equal">
              <FormTextarea
                type="text"
                name="text"
                fielddata={fields.text}
                changed={(e, result) => formChange(e, result, 'APPLICATION_STATUS_COMMENT_FRM')}
                containerclassname="secondary"
              />
            </Form.Group>
            <div className="center-align">
              <Button.Group>
                <Button className="very relaxed" disabled={!APPLICATION_STATUS_COMMENT_FRM.meta.isValid} onClick={params.action === 'PROMOTE' ? this.promoteApplication : this.updateApplicationStatus} loading={inProgress} color="green">Submit</Button>
              </Button.Group>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
