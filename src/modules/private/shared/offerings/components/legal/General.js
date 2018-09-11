import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Header, Button, Icon } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class General extends Component {
  render() {
    const { GENERAL_FRM, formChange, maskChange } = this.props.offeringCreationStore;
    const formName = 'GENERAL_FRM';
    return (
      <Form>
        <div className="featured-section">
          <Header as="h4">
            General Information
          </Header>
          <Form.Group widths={3}>
            {
              ['websiteUrl', 'monthOfOfferingLaunch'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              ))
            }
            <MaskedInput
              name="offeringDeadline"
              fielddata={GENERAL_FRM.fields.offeringDeadline}
              changed={(values, name) => maskChange(values, formName, name)}
              dateOfBirth
            />
            {
              ['employmentIdentificationNumber', 'numberOfEmployees'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                />
              ))
            }
          </Form.Group>
          <Header as="h4">Contact</Header>
          <Form.Group widths={3}>
            {
              ['businessStreetAddress', 'businessState', 'businessCity'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(e, result) => formChange(e, result, formName)}
                />
              ))
            }
            {
              ['businessStreetZip', 'businessPhoneNumber'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                />
              ))
            }
          </Form.Group >
          <Header as="h4">Banking</Header>
          <Form.Group widths={3}>
            <FormInput
              name="bankName"
              fielddata={GENERAL_FRM.fields.bankName}
              changed={(e, result) => formChange(e, result, formName)}
            />
            {
              ['bankRoutingNumber', 'bankAccountNumber'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, formName, name)}
                />
              ))
            }
          </Form.Group >
        </div>
        <div className="featured-section">
          <Header as="h4">Business Capitalization</Header>
          <p>{GENERAL_FRM.fields.businessCapitalization.label}</p>
          <FormTextarea
            name="businessCapitalization"
            fielddata={GENERAL_FRM.fields.businessCapitalization}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
            hidelabel
          />
        </div>
        <div className="featured-section">
          <Header as="h4">Use of Proceeds</Header>
          <p>
            {`Provide details on how you plan on allocating funds.
              Descriptions such as "working capital" or "pre-opening costs" will need further explanation.
              This section will also be public on the offering page.`}
          </p>
          {
            ['ifMinOfferingAmtReached', 'ifMaxOfferingAmtReached'].map(field => (
              <FormTextarea
                key={field}
                name={field}
                fielddata={GENERAL_FRM.fields[field]}
                changed={(e, result) => formChange(e, result, formName)}
                containerclassname="secondary"
              />
            ))
          }
        </div>
        <div className="featured-section">
          <Header as="h4">Existing Securities</Header>
        </div>
        <div className="featured-section">
          <Header as="h4">Other Exempt Offerings</Header>
        </div>
        <div className="featured-section">
          <Header as="h4">Material Terms of any Indebteness</Header>
        </div>
        <div className="featured-section">
          <Header as="h4">Affiliated Party Transactions</Header>
        </div>
        <div className="featured-section">
          <Header as="h4">Describe Rights of Your Equity Shareholders</Header>
          <p>{GENERAL_FRM.fields.rightsOfYourEquityShareholders.label}</p>
          <FormTextarea
            name="rightsOfYourEquityShareholders"
            fielddata={GENERAL_FRM.fields.rightsOfYourEquityShareholders}
            changed={(e, result) => formChange(e, result, formName)}
            containerclassname="secondary"
            hidelabel
          />
        </div>
        <div className="clearfix mb-20">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Submitted by ISSUER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            <Button inverted color="red" content="Decline" disabled={!GENERAL_FRM.meta.isValid} />
            <Button color="green" className="relaxed" disabled={!GENERAL_FRM.meta.isValid} >Approve</Button>
          </Button.Group>
        </div>
        <div className="clearfix">
          <Button as="span" className="time-stamp">
            <Icon className="ns-check-circle" color="green" />
            Approved by MANAGER_NAME on 2/3/2018
          </Button>
          <Button.Group floated="right">
            <Button primary type="button" className="relaxed pull-right" disabled={!GENERAL_FRM.meta.isValid} >Save</Button>
          </Button.Group>
        </div>
      </Form>
    );
  }
}
