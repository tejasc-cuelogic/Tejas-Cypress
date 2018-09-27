import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore', 'businessAppStore', 'userStore')
@observer
export default class Documentation extends Component {
  componentWillMount() {
    this.props.businessAppReviewStore.setFormData('DOCUMENTATION_FRM', 'review.documentation');
    this.props.businessAppReviewStore.setFormData('MANAGERS_FRM', 'review.documentation.managerOverview');
  }
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('DOCUMENTATION_FRM');
  }
  submitWithApproval = (form, action) => {
    this.props.businessAppReviewStore.saveReviewForms(form, action);
  }
  render() {
    const { DOCUMENTATION_FRM, formChange, updateStatuses } = this.props.businessAppReviewStore;
    const { roles } = this.props.userStore.currentUser;
    const isManager = roles && roles.includes('manager');
    const { businessApplicationDetailsAdmin } = this.props.businessAppStore;
    const { review } = businessApplicationDetailsAdmin;
    const submitted = (review && review.documentation && review.documentation &&
      review.documentation.submitted) ? review.documentation.submitted : null;
    const approved = (review && review.documentation && review.documentation &&
      review.documentation.approved) ? review.documentation.approved : null;
    const isReadonly = ((submitted && !isManager) || (isManager && approved));
    updateStatuses('documentation', submitted, approved);
    return (
      <div>
        <Form onSubmit={this.submit}>
          <Header as="h5">
            Prior Two Years Tax Returns for Control Owners or Three Years for Existing Business
          </Header>
          {
            ['negativeInformation', 'matchHistoricals', 'backupProof'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                disabled={isReadonly}
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
            ['profitiable', 'questionableItems', 'negativeTrends'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                disabled={isReadonly}
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
              />
            ))
          }
          <Divider section />
          <Header as="h5">
            Prior Six Months Back Statements (Existing)
          </Header>
          {
            ['consistentBalance', 'anyUnusualMovements'].map(field => (
              <FormTextarea
                containerclassname={isReadonly ? 'display-only secondary' : 'secondary'}
                disabled={isReadonly}
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
            disabled={isReadonly}
            hidelabel
          />
          {!isManager && !approved &&
          <div className="right-align">
            <Button.Group>
              {!submitted &&
              <Button disabled={!DOCUMENTATION_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              }
              <Button onClick={() => this.submitWithApproval('DOCUMENTATION_FRM', 'REVIEW_SUBMITTED')} disabled={(!(DOCUMENTATION_FRM.meta.isValid) || submitted)} primary={!submitted} type="button">{submitted ? 'Awaiting Manager Approval' : 'Submit for Approval'}</Button>
            </Button.Group>
          </div>
          }
          {(submitted || isManager) &&
          <ManagerOverview isValid={DOCUMENTATION_FRM.meta.isValid} formName="DOCUMENTATION_FRM" approved={approved} isReadonly={isReadonly} />
          }
        </Form>
      </div>
    );
  }
}
