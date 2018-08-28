import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Icon, Label, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../../../theme/form';

@inject('businessAppStore', 'uiStore')
@observer
export default class Performance extends Component {
  render() {
    const {
      BUSINESS_PERF_FRM, businessAppEleChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_PERF_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">Financial Statements</Header>
          <Form.Group widths={3}>
            {
            ['priorToThreeYear', 'ytd', 'fiveYearProjection'].map(field => (
              <div className="field display-only" key={field}>
                <Label>{fields[field].label}</Label>
                <div className="display-only">
                  <List>
                    <List.Item>
                      <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
                    </List.Item>
                  </List>
                </div>
              </div>
            ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Performance</Header>
          <p><b>Prior Year</b></p>
          <Form.Group widths={4}>
            {
              ['pyGrossSales', 'pyCogs', 'pyOperatingExpenses', 'pyNetIncome'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <p><b>Future Year</b></p>
          <Form.Group widths={4}>
            {
              ['nyGrossSales', 'nyCogs', 'nyOperatingExpenses', 'nyNetIncome'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
      </Form>
    );
  }
}
