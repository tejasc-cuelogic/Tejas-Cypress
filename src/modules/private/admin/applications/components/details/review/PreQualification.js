import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Aux from 'react-aux';
import { Form, Header, Button, Confirm } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class PreQual extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('JUSTIFICATIONS_FRM', 'review.preQualification');
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.preQualification.managerOverview');
  }
  addJustification = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('JUSTIFICATIONS_FRM');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('JUSTIFICATIONS_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.approveOrSubmitReviewForms(form, action);
  }
  render() {
    const {
      JUSTIFICATIONS_FRM, toggleConfirmModal, confirmModal, confirmModalName,
      formChangeWithIndex, removeData,
    } = this.props.businessAppReviewStore;
    const { roles } = this.props.userStore.currentUser;
    const isManager = roles && roles.includes('manager');
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { review } = businessApplicationDetailsAdmin;
    const submitted = (review && review.preQualification && review.preQualification.submitted)
      ? review.preQualification.submitted : null;
    const approved = (review && review.preQualification && review.preQualification.approved)
      ? review.preQualification.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved));
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <Header as="h4">
            Justifications
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addJustification(e)}><small>+Add Justification</small></Link>
            }
          </Header>
          {
            JUSTIFICATIONS_FRM.fields.justifications.map((justifications, index) => (
              <Aux>
                <FormTextarea
                  containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                  disabled={isReadonly}
                  name="justifications"
                  label={`Justification ${index + 1}`}
                  fielddata={justifications.justifications}
                  changed={(e, result) => formChangeWithIndex(e, result, 'JUSTIFICATIONS_FRM', 'justifications', index)}
                  removed={!isReadonly ? e => this.toggleConfirmModal(e, index, 'JUSTIFICATIONS_FRM') : false}
                  linkto={this.props.match.url}
                />
              </Aux>
            ))
          }
          {!isManager && !approved &&
          <div className="right-align">
            <Button onClick={() => this.submitWithApproval('JUSTIFICATIONS_FRM', 'REVIEW_SUBMITTED')} disabled={(!(JUSTIFICATIONS_FRM.meta.isValid) || submitted)} primary={!submitted} className="relaxed" >{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
          </div>
          }
          {(submitted || isManager) &&
          <ManagerOverview approved={approved} isReadonly={isReadonly} formName="JUSTIFICATIONS_FRM" isValid={JUSTIFICATIONS_FRM.meta.isValid} />
          }
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this justification?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
