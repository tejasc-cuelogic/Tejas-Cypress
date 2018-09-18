import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Header, Button, Icon, Confirm } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../../theme/form';

@inject('offeringCreationStore')
@observer
export default class General extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('GENERAL_FRM', 'legal', 'general');
  }
  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  render() {
    const {
      GENERAL_FRM,
      formArrayChange,
      maskArrayChange,
      removeData,
      confirmModal,
      confirmModalName,
    } = this.props.offeringCreationStore;
    const formName = 'GENERAL_FRM';
    const shorthandName = 'businessName';
    const minimumOfferingAmount = '23,345';
    const offeringAmount = '12,345';
    return (
      <Aux>
        <Form>
          <div className="featured-section">
            <Header as="h4">
              General Information
            </Header>
            <Form.Group widths={3}>
              {
                ['websiteUrl', 'monthLaunch'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    fielddata={GENERAL_FRM.fields[field]}
                    changed={(e, result) => formArrayChange(e, result, formName)}
                  />
                ))
              }
              <MaskedInput
                name="offeringDeadline"
                fielddata={GENERAL_FRM.fields.offeringDeadline}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                dateOfBirth
              />
              {
                ['employmentIdNumber', 'numOfEmployees'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    fielddata={GENERAL_FRM.fields[field]}
                    changed={(values, name) => maskArrayChange(values, formName, name)}
                    number
                  />
                ))
              }
            </Form.Group>
            <Header as="h4">Contact</Header>
            <Form.Group widths={3}>
              {
                ['businessStreet', 'businessCity', 'businessState'].map(field => (
                  <FormInput
                    key={field}
                    name={field}
                    fielddata={GENERAL_FRM.fields[field]}
                    changed={(e, result) => formArrayChange(e, result, formName)}
                  />
                ))
              }
              {
                ['businessZip', 'number'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    fielddata={GENERAL_FRM.fields[field]}
                    changed={(values, name) => maskArrayChange(values, formName, name)}
                    zipCode={field === 'businessZip'}
                    phoneNumber={field === 'number'}
                    format={field === 'number' ? '###-###-####' : '#####'}
                  />
                ))
              }
            </Form.Group >
            <Header as="h4">Banking</Header>
            <Form.Group widths={3}>
              <FormInput
                name="bankName"
                fielddata={GENERAL_FRM.fields.bankName}
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
              {
                ['bankRoutingNumber', 'accountNumber'].map(field => (
                  <MaskedInput
                    key={field}
                    name={field}
                    fielddata={GENERAL_FRM.fields[field]}
                    changed={(values, name) => maskArrayChange(values, formName, name)}
                    accountNumber={field === 'accountNumber'}
                    routingNumber={field === 'bankRoutingNumber'}
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
              changed={(e, result) => formArrayChange(e, result, formName)}
              containerclassname="secondary"
              placeholder={`Because ${shorthandName} was formed recently, the Issuer’s operations are limited and there are no historical results of operation to report.  The Issuer anticipates that the total cost of the project will be approximately $[X]. ${shorthandName} is seeking to crowdfund an amount between the minimum of $${minimumOfferingAmount} and maximum of $${offeringAmount} through the Offering. ${shorthandName} has also raised $[x] through sale of equity interests. If ${shorthandName} is able to complete a successful Offering, the members of the Issuer have committed to provide or arrange for sufficient financing for the Issuer to cover the remaining balance of the project cost. Please also see Section V – “Financial Statements” and Appendix A for more information.`}
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
              ['reachedMinOfferingGoal', 'reachedMaxOfferingGoal'].map(field => (
                <FormTextarea
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                  containerclassname="secondary"
                />
              ))
            }
          </div>
          <div className="featured-section">
            <Header as="h4">Describe Rights of Your Equity Shareholders</Header>
            <p>{GENERAL_FRM.fields.rightsOfEqShareHolders.label}</p>
            <FormTextarea
              name="rightsOfEqShareHolders"
              fielddata={GENERAL_FRM.fields.rightsOfEqShareHolders}
              changed={(e, result) => formArrayChange(e, result, formName)}
              containerclassname="secondary"
              hidelabel
            />
          </div>
          <div className="featured-section">
            <Header as="h4">Existing Securities</Header>
            {
              GENERAL_FRM.fields.security.map((security, index) => (
                <Aux>
                  <Header as="h5">{`Security ${index + 1}`}</Header>
                  <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'security')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  <Form.Group widths={2}>
                    {
                      ['class', 'votingRights', 'securitiesAuthorized', 'securitiesOutstanding'].map(field => (
                        <FormInput
                          key={field}
                          name={field}
                          fielddata={security[field]}
                          changed={(e, result) => formArrayChange(e, result, formName, 'security', index)}
                        />
                      ))
                    }
                  </Form.Group >
                  <FormInput
                    name="limitDiluteQualify"
                    fielddata={security.limitDiluteQualify}
                    changed={(e, result) => formArrayChange(e, result, formName, 'security', index)}
                  />
                </Aux>
              ))
            }
            <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, formName, 'security')}>+ Add New Security</Button>
          </div>
          <div className="featured-section">
            <Header as="h4">Other Exempt Offerings</Header>
            <p>Describe any past fund raises in the last 3 years.</p>
            {
              GENERAL_FRM.fields.exemptOfferings.map((offering, index) => (
                <Aux>
                  <Header as="h5">{`Other Exempt Offering ${index + 1}`}</Header>
                  <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'exemptOfferings')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  <Form.Group widths={2}>
                    {
                      ['dateOfOffering', 'securitiesExemption', 'securitiesOffered', 'amountSold'].map(field => (
                        <FormInput
                          hoverable={field === 'securitiesExemptionReliedUpon'}
                          key={field}
                          name={field}
                          fielddata={offering[field]}
                          changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                        />
                      ))
                    }
                  </Form.Group >
                  <FormTextarea
                    name="useOfProceeds"
                    fielddata={offering.useOfProceeds}
                    changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                    containerclassname="secondary"
                  />
                </Aux>
              ))
            }
            <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, formName, 'exemptOfferings')}>+ Add New Other Exempt Offering</Button>
          </div>
          <div className="featured-section">
            <Header as="h4">Material Terms of any Indebteness</Header>
            {
              GENERAL_FRM.fields.materialIndebtedness.map((terms, index) => (
                <Aux>
                  <Header as="h5">{`Term ${index + 1}`}</Header>
                  <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'materialIndebtedness')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                  <FormInput
                    name="creditorName"
                    fielddata={terms.creditorName}
                    changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                  />
                  <Form.Group widths={2}>
                    {
                      ['amountOutstanding', 'interestRate', 'maturityDate'].map(field => (
                        <MaskedInput
                          key={field}
                          name={field}
                          fielddata={terms[field]}
                          changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                          percentage={field === 'interestRate'}
                          currency={field === 'amountOutStanding'}
                          prefix={field === 'amountOutStanding' ? '$' : ''}
                          dateOfBirth={field === 'maturityDate'}
                        />
                      ))
                    }
                    <FormInput
                      name="paymentSchedule"
                      fielddata={terms.paymentSchedule}
                      changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                    />
                  </Form.Group >
                  <FormTextarea
                    name="otherTerms"
                    fielddata={terms.otherTerms}
                    changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                    containerclassname="secondary"
                  />
                </Aux>
              ))
            }
            <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, formName, 'materialIndebtedness')}>+ Add New Term</Button>
          </div>
          <div className="featured-section">
            <Header as="h4">Affiliated Party Transactions</Header>
            <p>In the past year (and looking forward),
              has the business entered into any transactions with affiliated parties
              (i.e., affiliated entities, directors or relatives)?
            </p>
            {
            GENERAL_FRM.fields.affiliatedTransactions.map((transaction, index) => (
              <Aux>
                <Header as="h5">{`Transaction ${index + 1}`}</Header>
                <Link to={this.props.match.url} className="icon-link" onClick={e => this.toggleConfirmModal(e, index, 'affiliatedTransactions')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                <FormInput
                  name="name"
                  fielddata={transaction.name}
                  changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                />
                <Form.Group widths={2}>
                  <FormInput
                    name="relationship"
                    fielddata={transaction.relationship}
                    changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  />
                  <MaskedInput
                    currency
                    prefix="$"
                    name="amountTransaction"
                    fielddata={transaction.amountTransaction}
                    changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  />
                </Form.Group >
                <FormTextarea
                  name="description"
                  fielddata={transaction.description}
                  changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  containerclassname="secondary"
                />
              </Aux>
            ))
            }
            <Button size="small" color="blue" className="link-button" onClick={e => this.addMore(e, formName, 'affiliatedTransactions')}>+ Add New Affiliated Party</Button>
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
        <Confirm
          header="Confirm"
          content={`Are you sure you want to remove this ${confirmModalName === 'security' ? 'security' :
          confirmModalName === 'exemptOfferings' ? 'other exempt offering' : ''} `}
          open={confirmModal}
          onCancel={this.toggleConfirmModal}
          onConfirm={() => removeData('GENERAL_FRM', confirmModalName)}
          size="mini"
          className="deletion"
        />
      </Aux>
    );
  }
}
