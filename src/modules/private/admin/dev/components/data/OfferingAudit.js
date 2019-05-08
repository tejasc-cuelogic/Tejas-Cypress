import React, { Component } from 'react';
import { Card, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';
// import { FieldError } from '../../../../../../theme/shared';

@inject('dataStore')
@withRouter
@observer
export default class OfferingAudit extends Component {
  componentWillMount() {
    this.props.dataStore.resetForm('OFFERING_REPAYMENT_META_FRM');
  }
  onSubmit = () => {
    this.props.dataStore.updateOfferingRepaymentsMeta();
  }
  render() {
    const { dataStore } = this.props;
    const { OFFERING_REPAYMENT_META_FRM, formChange, inProgress } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Offering Audit" />
        <Card.Content>
          <Card.Description>
            <Form error onSubmit={this.onSubmit}>
              <Form.Group className="bottom-aligned">
                <FormCheckbox
                  fielddata={OFFERING_REPAYMENT_META_FRM.fields.audit}
                  name="audit"
                  changed={(e, result) => formChange(e, result, 'OFFERING_REPAYMENT_META_FRM')}
                  defaults
                  containerwidth="1"
                  containerclassname="ui relaxed list"
                />
                <FormInput
                  type="text"
                  name="offeringId"
                  showerror
                  containerwidth="11"
                  fielddata={OFFERING_REPAYMENT_META_FRM.fields.offeringId}
                  changed={(e, result) => formChange(e, result, 'OFFERING_REPAYMENT_META_FRM')}
                />
                <Form.Field width={4}>
                  <Button primary fluid content="Update the Offering Closure Repayment" disabled={!OFFERING_REPAYMENT_META_FRM.meta.isValid || inProgress.offeringRepayment} loading={inProgress.offeringRepayment} />
                </Form.Field>
              </Form.Group>
            </Form>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
