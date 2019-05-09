import React, { Component } from 'react';
import { Card, Button, Form, Header } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';
import Aux from 'react-aux';
import { FormInput, FormCheckbox } from '../../../../../../theme/form';

@inject('dataStore')
@withRouter
@observer
export default class OfferingAudit extends Component {
  componentWillMount() {
    this.props.dataStore.resetOfferingAudit();
  }
  onSubmit = () => {
    this.props.dataStore.updateOfferingRepaymentsMeta();
  }
  render() {
    const { dataStore } = this.props;
    const {
      OFFERING_REPAYMENT_META_FRM, formChange, inProgress, outputMsg,
    } = dataStore;
    return (
      <Card fluid className="elastic-search">
        <Card.Content header="Offering Audit" />
        <Card.Content>
          <Card.Description>
            <Form onSubmit={this.onSubmit}>
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
            {outputMsg &&
              <Aux>
                <Header as="h6">Output:</Header>
                {get(outputMsg, 'type') === 'error' ?
                  <p className="negative-text">{get(outputMsg, 'data')}</p> :
                  <dl className="dl-horizontal">
                    <dt>Offering Id</dt>
                    <dd>{get(outputMsg, 'data.offeringId') || 'N/A'}</dd>
                    <dt>Count</dt>
                    <dd>{get(outputMsg, 'data.count') || 'N/A'}</dd>
                    <dt>Current Repaid Amount</dt>
                    <dd>{get(outputMsg, 'data.currentRepaidAmount') || 'N/A'}</dd>
                  </dl>
                }
              </Aux>
            }
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
