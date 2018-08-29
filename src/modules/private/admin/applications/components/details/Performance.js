import React, { Component } from 'react';
import { Header, Form, Icon, Label, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../../../theme/form';
import { FILE_UPLOAD_HANDLE_URL } from '../../../../../../constants/common';
import { EmptyDataSet } from '../../../../../../theme/shared';

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
                    {fields[field].value.length ?
                    fields[field].value.map((item, index) => (
                      <List.Item>
                        <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${fields[field].fileId[index]}`}><Icon className="ns-file" /><b>{item}</b></a>
                      </List.Item>
                    )) : <EmptyDataSet title="No files uploaded yes." />}
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
