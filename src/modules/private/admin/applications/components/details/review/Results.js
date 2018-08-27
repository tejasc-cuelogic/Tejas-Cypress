import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Results extends Component {
  render() {
    const {
      MODEL_VARIABLES_FRM,
      maskChange,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">
          Rate Scale
        </Header>
        <Form>
          <Form.Group widths="equal">
            {
              ['min', 'mid', 'max'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_VARIABLES_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  percentage
                />
              ))
            }
          </Form.Group>
          <Header as="h4">
            Rate Progression
          </Header>
          <Form.Group widths="equal">
            {
              ['threeMonth', 'sixMonth', 'twoYear'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_VARIABLES_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  percentage
                />
              ))
            }
          </Form.Group>
          <Form.Group widths="equal">
            {
              ['fiveYear', 'tenYear', 'thirtyYear'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={MODEL_VARIABLES_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, 'MODEL_INPUTS_FRM', name)}
                  percentage
                />
              ))
            }
          </Form.Group>
        </Form>
      </Aux>
    );
  }
}
