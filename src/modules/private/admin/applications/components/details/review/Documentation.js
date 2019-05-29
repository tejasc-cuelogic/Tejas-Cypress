import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';
import ButtonGroup from './ButtonGroup';
import { InlineLoader } from '../../../../../../../theme/shared';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Documentation extends Component {
  componentWillMount() {
    if (!this.props.businessAppReviewStore.initLoad.includes('DOCUMENTATION_FRM')) {
      this.props.businessAppReviewStore.setFormData('DOCUMENTATION_FRM', 'review.documentation');
    }
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.documentation.managerOverview');
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('DOCUMENTATION_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const { DOCUMENTATION_FRM, formChange, inProgress } = this.props.businessAppReviewStore;
    const access = this.props.userStore.myAccessForModule('APPLICATIONS');
    const isManager = access.asManager;
    const {
      businessApplicationDetailsAdmin, applicationReviewLoading,
    } = this.props.businessAppStore;
    const { review, applicationStatus } = businessApplicationDetailsAdmin;
    const submitted = (review && review.documentation && review.documentation &&
      review.documentation.submitted) ? review.documentation.submitted : null;
    const approved = (review && review.documentation && review.documentation &&
      review.documentation.approved) ? review.documentation.approved : null;
    const isReadonly = ((((approved && approved.status) || (submitted && !approved))
      && !isManager) || (isManager && approved && approved.status));
    if (applicationReviewLoading) {
      return <InlineLoader />;
    }
    return (
      <div>
        <Form onSubmit={this.submit}>
          <ManagerOverview applicationStatus={applicationStatus} submitted={submitted} isManager={isManager} isValid={DOCUMENTATION_FRM.meta.isValid} formName="DOCUMENTATION_FRM" approved={approved} isReadonly={isReadonly} />
          <Header as="h5">
            Prior Two Years Tax Returns for Control Owners or Three Years for Existing Business
          </Header>
          {
            ['negativeInformation', 'matchHistoricals', 'backupProof'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
              />
            ))
          }
          <Divider section />
          <Header as="h5">
            Prior 2 Year Historical and YTD Financial Statements (Existing Business)
          </Header>
          {
            ['profitable', 'questionableItems', 'negativeTrends'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
              />
            ))
          }
          <Divider section />
          <Header as="h5">
            Prior Six Months Bank Statements (Existing)
          </Header>
          {
            ['consistentBalance', 'unusualMovements'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                readOnly={isReadonly}
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
              />
            ))
          }
          <Header as="h5">
            LOI/Lease or Mortgage
          </Header>
          <FormTextarea
            name="leaseOrMortgage"
            fielddata={DOCUMENTATION_FRM.fields.leaseOrMortgage}
            changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
            containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
            readOnly={isReadonly}
            hidelabel
          />
          <ButtonGroup
            inProgress={inProgress}
            formName="DOCUMENTATION_FRM"
            isReadonly={isReadonly}
            isManager={isManager}
            submitted={submitted}
            approved={approved}
            formValid={DOCUMENTATION_FRM.meta.isValid}
            submitWithApproval={this.submitWithApproval}
          />
        </Form>
      </div>
    );
  }
}
