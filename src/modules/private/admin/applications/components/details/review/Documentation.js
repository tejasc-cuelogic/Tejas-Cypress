import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Divider } from 'semantic-ui-react';
import { FormTextarea } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Documentation extends Component {
  render() {
    const { DOCUMENTATION_FRM, documentationEleChange } = this.props.businessAppReviewStore;
    return (
      <div>
        <Form>
          <Divider section />
          <Header as="h5">
            Prior Two Years Tax Returns for Control Owners or Three Years for Existing Business
          </Header>
          {
            ['taxReturnsForControlOwners', 'taxReturnsForBusinessMatch', 'backupProofOfIncomeAndAssets'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={documentationEleChange}
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
                changed={documentationEleChange}
                containerclassname="secondary"
              />
            ))
          }
          <Divider section />
          <Header as="h5">
            Prior Six Months Back Statements (Existing)
          </Header>
          {
            ['anyCushionForIncidentals', 'c'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={DOCUMENTATION_FRM.fields[field]}
                changed={documentationEleChange}
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
            changed={documentationEleChange}
            containerclassname="secondary"
            hidelabel
          />
          <Button.Group className="pull-right">
            <Button disabled={!DOCUMENTATION_FRM.meta.isValid} primary size="large" className="very relaxed" >Save</Button>
            <Button disabled={!DOCUMENTATION_FRM.meta.isValid} type="button">Submit for Approval</Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}
