import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form, Header } from 'semantic-ui-react';
import Contingency from './overview/Contingency';
import Actions from './overview/Actions';
import { MaskedInput } from '../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class Close extends Component {
  render() {
    const {
      OFFERING_CLOSE_FRM,
      CLOSING_CONTITNGENCIES_FRM,
      maskChange,
      formChangeWithIndex,
    } = this.props.offeringCreationStore;
    const formName = 'OFFERING_CLOSE_FRM';
    return (
      <Form>
        <div className="inner-content-spacer">
          <Contingency
            formChangeWithIndex={formChangeWithIndex}
            form={CLOSING_CONTITNGENCIES_FRM}
            formName="CLOSING_CONTITNGENCIES_FRM"
            addon={<Actions />}
          />
          <Header as="h4">Offer Closing Details</Header>
          <Form.Group widths="equal">
            <MaskedInput
              name="disbursementDate"
              fielddata={OFFERING_CLOSE_FRM.fields.disbursementDate}
              format="##-##-####"
              changed={(values, field) => maskChange(values, formName, field)}
              dateOfBirth
            />
            {
            ['disbursementAmount', 'totalRepayment'].map(field => (
              <MaskedInput
                name={field}
                fielddata={OFFERING_CLOSE_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                currency
                prefix="$"
              />
            ))
            }
          </Form.Group>
          <Form.Group widths={3}>
            {
            ['totalComittedAmount', 'totalInvestorsCount'].map(field => (
              <MaskedInput
                name={field}
                fielddata={OFFERING_CLOSE_FRM.fields[field]}
                changed={(values, name) => maskChange(values, formName, name)}
                number
              />
            ))
            }
          </Form.Group>
        </div>
      </Form>
    );
  }
}
