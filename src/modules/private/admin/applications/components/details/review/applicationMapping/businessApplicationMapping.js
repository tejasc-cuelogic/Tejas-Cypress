import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class BusinessApplicationMapping extends Component {
  render() {
    const {
      MODEL_INPUTS_FRM,
      maskChange,
    } = this.props.businessAppReviewStore;
    return (
      <>
        <Form>
          <Header as="h4">Business Application Mapping</Header>
          <Form.Group widths={3}>
            {['grossSales', 'grossProfit', 'totalOperExp'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                prefix="$"
                currency
              />
            ))}
            {['dda', 'interest', 'tax'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                number
              />
            ))}
          </Form.Group>
          <Header as="h4">Projected Revenue</Header>
          <Form.Group widths={3}>
            {['y1', 'y2', 'y3', 'y4', 'y5'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_INPUTS_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                prefix="$"
                currency
              />
            ))}
          </Form.Group>
        </Form>
      </>
    );
  }
}
