import React, { Component } from 'react';
import { Header, Form, Icon, List } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { FormInput } from '../../../../../../theme/form';
import { FILE_UPLOAD_HANDLE_URL } from '../../../../../../constants/common';
import { EmptyDataSet } from '../../../../../../theme/shared';

@inject('businessAppStore', 'uiStore')
@observer
export default class BusinessDetails extends Component {
  render() {
    const {
      BUSINESS_DETAILS_FRM, businessAppEleChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_DETAILS_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">Business Plan</Header>
          <List>
            {fields.businessPlan.value.length ?
            fields.businessPlan.value.map((item, index) => (
              <List.Item>
                <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${fields.businessPlan.fileId[index]}`}><Icon className="ns-file" /><b>{item}</b></a>
              </List.Item>
            )) : <EmptyDataSet title="No files uploaded yes." />}
          </List>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Exising Debt</Header>
          {
          fields.debts.length &&
          fields.debts.map((debt, index) => (
            <Aux key={new Date()}>
              <p><b>Debt {index + 1}</b></p>
              <Form.Group widths={4}>
                {
                ['amount', 'interestExpenses', 'remainingPrincipal', 'term'].map(field => (
                  <FormInput
                    disabled={preQualFormDisabled}
                    key={field}
                    type="text"
                    name={field}
                    value="Value"
                    fielddata={debt[field]}
                    changed={businessAppEleChange}
                    containerclassname="display-only"
                    readOnly
                  />
                ))
                }
              </Form.Group>
            </Aux>
          ))
          }
        </div>
        {
        fields.owners.length &&
        fields.owners.map((owner, index) => (
          <div className="inner-content-spacer" key={new Date()}>
            <Header as="h4">Owners</Header>
            <p><b>Owner {index + 1}</b></p>
            <Form.Group widths={4}>
              {
              ['fullLegalName', 'yearsOfExp', 'ssn', 'companyOwnerShip'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={owner[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
              }
            </Form.Group>
            <Form.Group widths={4}>
              {
              ['linkedInUrl', 'title'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={owner[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
              }
            </Form.Group>
            {owner.resume.value !== '' ?
              <a target="_blank" rel="noopener noreferrer" href={`${FILE_UPLOAD_HANDLE_URL}${owner.resume.fileId}`}><Icon className="ns-file" /><b>{owner.resume.value}</b></a>
            : <EmptyDataSet title="No files uploaded yes." />}
          </div>
      ))
      }
      </Form>
    );
  }
}
