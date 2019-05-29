import React, { Component } from 'react';
import Aux from 'react-aux';
import { observer, inject } from 'mobx-react';
import { Header, Form, Table, Button } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';

@inject('businessAppReviewStore')
@observer
export default class Variables extends Component {
  render() {
    const {
      MODEL_VARIABLES_FRM,
      maskChange,
    } = this.props.businessAppReviewStore;
    return (
      <Aux>
        <Header as="h4">Rate Scale</Header>
        <Form>
          <Form.Group widths={3}>
            {['min', 'mid', 'max'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_VARIABLES_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                percentage
              />
            ))}
          </Form.Group>
          <Header as="h4">Rate Progression</Header>
          <Form.Group widths={3}>
            {['threeMonth', 'sixMonth', 'twoYear', 'fiveYear', 'tenYear', 'thirtyYear'].map(field => (
              <MaskedInput
                key={field}
                name={field}
                fielddata={MODEL_VARIABLES_FRM.fields[field]}
                changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                percentage
                maxlength={5}
              />
            ))}
          </Form.Group>
          <Header as="h4">Score Scale</Header>
          <Table basic compact singleLine className="form-table">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Boundary 1</Table.HeaderCell>
                <Table.HeaderCell>Boundary 2</Table.HeaderCell>
                <Table.HeaderCell>Boundary 3</Table.HeaderCell>
                <Table.HeaderCell>Boundary 4</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>FICO</Table.Cell>
                {['ficoB1', 'ficoB2', 'ficoB3', 'ficoB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>Company Age</Table.Cell>
                {['companyAgeB1', 'companyAgeB2', 'companyAgeB3', 'companyAgeB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>DSCR</Table.Cell>
                {['dscrB1', 'dscrB2', 'dscrB3', 'dscrB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>NI Margin</Table.Cell>
                {['niMarginB1', 'niMarginB2', 'niMarginB3', 'niMarginB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>LTV</Table.Cell>
                {['ltvB1', 'ltvB2', 'ltvB3', 'ltvB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
              <Table.Row>
                <Table.Cell>Industry Experience</Table.Cell>
                {['industryExperienceB1', 'industryExperienceB2', 'industryExperienceB3', 'industryExperienceB4'].map(field => (
                  <Table.Cell verticalAlign="top">
                    <MaskedInput
                      key={field}
                      name={field}
                      fielddata={MODEL_VARIABLES_FRM.fields[field]}
                      changed={(values, name) => maskChange(values, 'MODEL_VARIABLES_FRM', name)}
                      number
                    />
                  </Table.Cell>
                ))}
              </Table.Row>
            </Table.Body>
          </Table>
          <div className="right-align mt-20">
            <Button disabled={!MODEL_VARIABLES_FRM.meta.isValid} primary className="relaxed" type="button">Save & Update Results</Button>
          </div>
        </Form>
      </Aux>
    );
  }
}
