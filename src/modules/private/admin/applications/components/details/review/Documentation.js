import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';
import ManagerOverview from './ManagerOverview';

@inject('businessAppReviewStore')
@observer
export default class Documentation extends Component {
  submit = () => {
    this.props.businessAppReviewStore.saveReviewForms('PROJECTIONS_FRM');
  }
  render() {
    const {
      DOCUMENTATION_FRM,
      DOCUMENTATION_MANAGER_FRM,
      formChange,
    } = this.props.businessAppReviewStore;
    return (
      <div>
        <Form onSubmit={this.submit}>
          <Header as="h5">
            Prior Two Years Tax Returns for Control Owners or Three Years for Existing Business
          </Header>
          {
            ['negativeInformation', 'matchHistoricals', 'backupProof'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
                containerclassname="secondary"
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
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
                containerclassname="secondary"
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
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, 'DOCUMENTATION_FRM')}
                containerclassname="secondary"
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
            containerclassname="secondary"
            hidelabel
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!DOCUMENTATION_FRM.meta.isValid} secondary className="relaxed">Save</Button>
              <Button disabled={!DOCUMENTATION_FRM.meta.isValid} primary type="button">Submit for Approval</Button>
            </Button.Group>
          </div>
          <ManagerOverview form={DOCUMENTATION_MANAGER_FRM} formName="DOCUMENTATION_MANAGER_FRM" />
        </Form>
      </div>
    );
  }
}
