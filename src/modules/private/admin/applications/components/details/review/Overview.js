/* eslint-disable jsx-a11y/label-has-for */
import React, { Component } from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Form, Header, Confirm } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Overview extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('OVERVIEW_FRM')) {
      this.props.businessAppReviewStore.setFormData('OVERVIEW_FRM', 'review.overview.criticalPoint');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.overview.managerOverview');
  }
  addCriticalPoint = (e) => {
    e.preventDefault();
    this.props.businessAppReviewStore.addMore('OVERVIEW_FRM', 'description');
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.businessAppReviewStore.toggleConfirmModal(index, formName);
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('OVERVIEW_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const {
      OVERVIEW_FRM, formChangeWithIndex, confirmModal, toggleConfirmModal,
      removeData, confirmModalName, inProgress,
    } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.overview && review.overview.criticalPoint &&
      review.overview.criticalPoint.submitted) ? review.overview.criticalPoint.submitted : null;
    const approved = (review && review.overview && review.overview.criticalPoint &&
      review.overview.criticalPoint.approved) ? review.overview.criticalPoint.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <Aux>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} formName="OVERVIEW_FRM" submitted={submitted} isManager={isManager} approved={approved} isReadonly={isReadonly} isValid={OVERVIEW_FRM.meta.isValid} />
          <Header as="h4">
            Overview
            {!isReadonly && OVERVIEW_FRM.fields.description.length < 5 &&
            <Link to={this.props.match.url} className="link" onClick={this.addCriticalPoint}><small>+ Add Critical Point</small></Link>
            }
          </Header>
          {
            OVERVIEW_FRM.fields.description.map((field, index) => (
              <FormInput
                containerclassname={isReadonly ? 'display-only' : ''}
                readOnly={isReadonly}
                name="description"
                label={`Critical Point ${index + 1}`}
                fielddata={field.description}
                changed={(e, result) => formChangeWithIndex(e, result, 'OVERVIEW_FRM', 'description', index)}
                removed={!isReadonly && OVERVIEW_FRM.fields.description.length > 1 ? e => this.toggleConfirmModal(e, index, 'OVERVIEW_FRM') : false}
                linkto={this.props.match.url}
              />
            ))
          }
          <ButtonGroup
            showDeclinedBtn
            inProgress={inProgress}
            formName="OVERVIEW_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={OVERVIEW_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
        <Confirm
          header="Confirm"
          content="Are you sure you want to remove this critical point?"
          open={confirmModal}
          onCancel={toggleConfirmModal}
          onConfirm={() => removeData(confirmModalName, 'description')}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
