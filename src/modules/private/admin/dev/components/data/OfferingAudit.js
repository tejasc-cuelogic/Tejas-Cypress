import React, { Component } from 'react';
import { Card, Button, Form, Header, Table } from 'semantic-ui-react';
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
                  containerwidth="21"
                  containerclassname="ui relaxed list"
                />
                <FormInput
                  type="text"
                  name="offeringId"
                  showerror
                  containerwidth="14"
                  fielddata={OFFERING_REPAYMENT_META_FRM.fields.offeringId}
                  changed={(e, result) => formChange(e, result, 'OFFERING_REPAYMENT_META_FRM')}
                />
                <Form.Field width={16}>
                  <Button primary content="Update the Offering Closure Repayment" disabled={inProgress.offeringRepayment} loading={inProgress.offeringRepayment} />
                </Form.Field>
              </Form.Group>
            </Form>
            {outputMsg
              && (
              <Aux>
                <Header as="h6">Output:</Header>
                {get(outputMsg, 'type') === 'error'
                  ? <p className="negative-text">{get(outputMsg, 'data')}</p> : get(outputMsg, 'data[0]')
                    ? (
                      <div className="table-wrapper">
                        <Table unstackable singleLine className="investment-details">
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>OfferingId</Table.HeaderCell>
                              <Table.HeaderCell>Count</Table.HeaderCell>
                              <Table.HeaderCell>Current Repaid Amount</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {get(outputMsg, 'data').map(data => (
                              <Table.Row key={data.offeringId}>
                                <Table.Cell>{data.offeringId}</Table.Cell>
                                <Table.Cell>{data.count}</Table.Cell>
                                <Table.Cell>{data.currentRepaidAmount}</Table.Cell>
                              </Table.Row>
                            ))
                          }
                          </Table.Body>
                        </Table>
                      </div>
                    ) : null
                }
              </Aux>
              )
            }
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}
