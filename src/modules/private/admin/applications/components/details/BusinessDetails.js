import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../../../theme/form';

@inject('businessAppStore', 'uiStore')
@observer
export default class BusinessDetails extends Component {
  render() {
    const {
      BUSINESS_DETAILS_FRM, businessAppEleChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">Business Plan</Header>
          <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Exising Debt</Header>
          <p><b>Debt 1</b></p>
          {
          BUSINESS_DETAILS_FRM.fields.debts.length &&
          BUSINESS_DETAILS_FRM.fields.debts.map(debt => (
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
          ))
          }
        </div>
        {
        BUSINESS_DETAILS_FRM.fields.owners.length &&
        BUSINESS_DETAILS_FRM.fields.owners.map(owner => (
          <div className="inner-content-spacer">
            <Header as="h4">Owners</Header>
            <p><b>Owner 1</b></p>
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
            <Form.Group widths={4}>
              <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
            </Form.Group>
          </div>
      ))
      }
      </Form>
    );
  }
}
