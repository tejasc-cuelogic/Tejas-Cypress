import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Form, Header, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class PreQual extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('JUSTIFICATIONS_FRM')) {
      this.props.businessAppReviewStore.setFormData('JUSTIFICATIONS_FRM', 'review.preQualification');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.preQualification.managerOverview');
  }
  addJustification = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('JUSTIFICATIONS_FRM', 'justifications');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('JUSTIFICATIONS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      JUSTIFICATIONS_FRM, toggleConfirmModal, confirmModal, confirmModalName,
      formChangeWithIndex, removeData, inProgress,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.preQualification && review.preQualification.submitted)
      ? review.preQualification.submitted : null;
    const approved = (review && review.preQualification && review.preQualification.approved)
      ? review.preQualification.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} approved={approved} isReadonly={isReadonly} formName="JUSTIFICATIONS_FRM" isValid={JUSTIFICATIONS_FRM.meta.isValid} />
          <Header as="h4">
            Justifications
            {!isReadonly && JUSTIFICATIONS_FRM.fields.justifications.length < 5 &&
            <Link to={this.props.match.url} className="link" onClick={this.addJustification}><small>+Add Justification</small></Link>
            }
          </Header>
          {
            JUSTIFICATIONS_FRM.fields.justifications.map((justifications, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  readOnly={isReadonly}
                  name="justifications"
                  label={`Justification ${index + 1}`}
                  fielddata={justifications.justifications}
                  changed={(e, result) => formChangeWithIndex(e, result, 'JUSTIFICATIONS_FRM', 'justifications', index)}
                  removed={!isReadonly && JUSTIFICATIONS_FRM.fields.justifications.length > 1 ? e => this.toggleConfirmModal(e, index, 'JUSTIFICATIONS_FRM') : false}
                  linkto={this.props.match.url}
                />
              </Aux>
            ))
          }
          <ButtonGroup
            inProgress={inProgress}
            formName="JUSTIFICATIONS_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={JUSTIFICATIONS_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this justification?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'justifications')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
