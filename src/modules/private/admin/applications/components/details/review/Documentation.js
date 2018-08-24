import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Documentation extends Component {
  render() {
    const {
      DOCUMENTATION_FRM,
      formChange,
      MANAGERS_FRM,
    } = this.props.businessAppReviewStore;
    return (
      <div>
        <Form>
          <Header as="h5">
            Prior Two Years Tax Returns for Control Owners or Three Years for Existing Business
          </Header>
          {
            ['taxReturnsForControlOwners', 'taxReturnsForBusinessMatch', 'backupProofOfIncomeAndAssets'].map(field => (
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
            ['hasBusinessProfitable', 'anyQuestionableItems', 'anyNegativeTrends'].map(field => (
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
            ['anyCushionForIncidentals', 'anyUnusualMovements'].map(field => (
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
          <Divider section />
          <Header as="h4">Manager</Header>
          <FormTextarea
            name="managerOverview"
            fielddata={MANAGERS_FRM.fields.managerOverview}
            changed={(e, result) => formChange(e, result, 'MANAGERS_FRM')}
            containerclassname="secondary"
          />
          <div className="right-align">
            <Button.Group>
              <Button disabled={!MANAGERS_FRM.meta.isValid} className="relaxed" secondary>Deny</Button>
              <Button disabled={!MANAGERS_FRM.meta.isValid} primary className="relaxed" type="button">Approve</Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}
