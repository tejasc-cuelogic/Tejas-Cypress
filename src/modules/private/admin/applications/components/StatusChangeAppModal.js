import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Button, Header, Form, Message } from 'semantic-ui-react';
import { capitalize } from 'lodash';
import { FormTextarea, FormInput } from '../../../../../theme/form';
import { ListErrors } from '../../../../../theme/shared';
import { adminActions } from '../../../../../services/actions';
import Helper from '../../../../../helper/utility';
import { ACTIVITY_HISTORY_TYPES } from '../../../../../constants/common';

@inject('uiStore', 'businessAppReviewStore', 'businessAppStore', 'adminStore', 'activityHistoryStore')
@withRouter
@observer
export default class StatusChangeAppModal extends Component {
  constructor(props) {
    super(props);
    this.props.businessAppReviewStore.resetCommentFrm();
    if (this.props.match.params.action === 'PROMOTE' && this.props.match.params.id !== 'in-progress') {
      this.props.businessAppReviewStore.resetPasswordFrm();
      this.props.businessAppReviewStore.resetEmailFrm();
      const { businessApplicationsDetailsAdmin, fetchAdminApplicationById } = this.props.businessAppStore;
      if (!businessApplicationsDetailsAdmin) {
        fetchAdminApplicationById(this.props.match.params.appId, this.props.match.params.id)
          .then(() => {
            this.props.businessAppReviewStore.resetEmailFrm();
          });
      }
    }
  }

  handleCloseModal = (e) => {
    e.stopPropagation();
    const { match } = this.props;
    const { params } = match;
    this.props.uiStore.setErrors(null);
    this.props.history.push(`/app/applications/${params.id}`);
  }

  updateApplicationStatus = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    this.props.businessAppReviewStore
      .updateApplicationStatus(params.appId, params.userId, params.appStatus, params.action)
      .then(() => {
        this.props.activityHistoryStore.send(params.appId, params.id === 'in-progress' ? 'Business Application Submitted' : 'Business Application Pre Qual Promoted', ACTIVITY_HISTORY_TYPES.COMMENT);
      })
      .then(() => {
        this.props.uiStore.setErrors(null);
        this.props.history.push(`/app/applications/${params.id}`);
      });
  }

  promoteApplication = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const { params } = match;
    const appType = 'prequal-failed';
    this.props.businessAppStore
      .fetchAdminApplicationById(params.appId, appType, params.userId, true)
      .then((data) => {
        const prequalData = (data && data.businessApplicationsDetailsAdmin) || null;
        const { PROMOTE_APPLICATION_STATUS_PASSWORD_FRM, PROMOTE_APPLICATION_STATUS_EMAIL_FRM } = this.props.businessAppReviewStore;
        const { applicationRoles } = this.props.businessAppStore;
        if (prequalData) {
          const userDetails = {
            givenName: prequalData.firstName,
            familyName: prequalData.lastName,
            email: !applicationRoles.includes('investor') ? prequalData.email : PROMOTE_APPLICATION_STATUS_EMAIL_FRM.fields.emailAddress.value,
            TemporaryPassword:
              PROMOTE_APPLICATION_STATUS_PASSWORD_FRM.fields.TemporaryPassword.value,
            verifyPassword: PROMOTE_APPLICATION_STATUS_PASSWORD_FRM.fields.verifyPassword.value,
            role: ['issuer'],
          };
          adminActions.checkEmailExists(userDetails.email).then((userId) => {
            if (userId) {
              this.props.businessAppReviewStore
                .updateApplicationStatus(
                  params.appId,
                  userId,
                  params.appStatus,
                  params.action,
                  '',
                  userDetails.TemporaryPassword,
                ).then(() => {
                  this.props.uiStore.setErrors(null);
                  this.props.history.push('/app/applications/in-progress');
                });
            } else {
              adminActions.createNewUser(userDetails, 'SUPPRESS').then(() => {
                // This timeout is added intentionally beacause of parellel mutation executes. Don't delete this
                setTimeout(() => {
                  this.props.businessAppReviewStore
                    .updateApplicationStatus(
                      params.appId,
                      this.props.adminStore.userId,
                      params.appStatus,
                      params.action,
                      '',
                      userDetails.TemporaryPassword,
                    ).then(() => {
                      this.props.uiStore.setErrors(null);
                      this.props.history.push('/app/applications/in-progress');
                    });
                }, 5000);
              }).catch(() => {
                Helper.toast('Something went wrong. Please try again after sometime', 'error');
              });
            }
          });
        }
      });
  }

  render() {
    const { uiStore, businessAppReviewStore, match } = this.props;
    const {
      formChange,
      PROMOTE_APPLICATION_STATUS_PASSWORD_FRM,
      PROMOTE_APPLICATION_STATUS_EMAIL_FRM,
    } = businessAppReviewStore;
    const { applicationRoles } = this.props.businessAppStore;
    const { ACTIVITY_FRM, msgEleChange } = this.props.activityHistoryStore;
    const { fields } = ACTIVITY_FRM;
    const { inProgress } = uiStore;
    const { errors } = uiStore;
    const { params } = match;
    let isValid = true;
    if (params.action === 'PROMOTE' && params.id !== 'in-progress') {
      isValid = !(ACTIVITY_FRM.meta.isValid
        && PROMOTE_APPLICATION_STATUS_PASSWORD_FRM.meta.isValid);
    } else {
      isValid = !ACTIVITY_FRM.meta.isValid;
    }
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          {params.action === 'PROMOTE' && params.id !== 'in-progress'
            ? <Header as="h3">Promote PreQual?</Header>
            : <Header as="h3">{params.action === 'REMOVED' ? 'Remove' : capitalize(params.id !== 'in-progress' ? params.action : 'Submit')} Application?</Header>
          }
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form error>
            <FormTextarea
              type="text"
              name="comment"
              label={params.id === 'in-progress' ? 'Please enter your justification for submission' : 'Please enter your comments here'}
              fielddata={fields.comment}
              changed={msgEleChange}
              containerclassname="secondary"
            />
            {params.action === 'PROMOTE' && params.id !== 'in-progress'
              ? (
              <>
                {applicationRoles && applicationRoles.includes('investor') && (
                  <>
                    <FormInput
                      fluid
                      type="text"
                      name="emailAddress"
                      fielddata={PROMOTE_APPLICATION_STATUS_EMAIL_FRM.fields.emailAddress}
                      changed={(e, result) => formChange(e, result, 'PROMOTE_APPLICATION_STATUS_EMAIL_FRM')}
                    />
                    {!PROMOTE_APPLICATION_STATUS_EMAIL_FRM.meta.isDirty
                      ? (
                        <p className="negative-text">
                          This email is already registered as an investor.  Please enter a new email address.
                        </p>
                      )
                      : ''
                    }
                  </>
                )}
                <FormInput
                  fluid
                  type="password"
                  name="TemporaryPassword"
                  fielddata={PROMOTE_APPLICATION_STATUS_PASSWORD_FRM.fields.TemporaryPassword}
                  changed={(e, result) => formChange(e, result, 'PROMOTE_APPLICATION_STATUS_PASSWORD_FRM')}
                />
                <FormInput
                  fluid
                  type="password"
                  name="verifyPassword"
                  fielddata={PROMOTE_APPLICATION_STATUS_PASSWORD_FRM.fields.verifyPassword}
                  changed={(e, result) => formChange(e, result, 'PROMOTE_APPLICATION_STATUS_PASSWORD_FRM')}
                />
              </>
              )
              : ''
            }
            {errors
              && (
              <Message error>
                <ListErrors errors={[errors]} />
              </Message>
              )
            }
            <div className="center-align">
              <Button primary className="very relaxed" content="Submit" disabled={isValid || inProgress} onClick={params.action === 'PROMOTE' && params.id !== 'in-progress' ? this.promoteApplication : this.updateApplicationStatus} loading={inProgress} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
