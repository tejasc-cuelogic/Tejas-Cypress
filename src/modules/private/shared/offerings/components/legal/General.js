import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Form, Header, Button, Icon, Confirm, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../../theme/form';
@inject('offeringCreationStore', 'userStore')
@observer
export default class General extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('GENERAL_FRM', 'legal.general');
    this.props.offeringCreationStore.setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
  }
  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  handleFormSubmit = () => {
    const { GENERAL_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, GENERAL_FRM.fields, 'legal', 'general');
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
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Form onSubmit={this.handleFormSubmit}>
          <Header as="h4">General Information</Header>
          <Form.Group widths={3}>
            {
              ['websiteUrl', 'monthLaunch', 'offeringDeadline'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={GENERAL_FRM.fields[field]}
                  changed={(e, result) => formArrayChange(e, result, formName)}
                />
              ))
            }
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
          <Divider section />
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
          <Divider section />
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
          <Divider section />
          <Header as="h4">Describe Rights of Your Equity Shareholders</Header>
          <p>{GENERAL_FRM.fields.rightsOfEqShareHolders.label}</p>
          <FormTextarea
            name="rightsOfEqShareHolders"
            fielddata={GENERAL_FRM.fields.rightsOfEqShareHolders}
            changed={(e, result) => formArrayChange(e, result, formName)}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Existing Securities
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'security')}><small>+ Add New Security</small></Link>
          </Header>
          {
            GENERAL_FRM.fields.security.map((security, index) => (
              <Aux>
                <Header as="h6">{`Security ${index + 1}`}
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'security')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Header>
                <div className="featured-section">
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
                </div>
              </Aux>
            ))
          }
          <Divider section />
          {/* <Button size="small" color="blue" className="link-button" onClick={e =>
            this.addMore(e, formName, 'security')}>+ Add New Security</Button> */}
          <Header as="h4">
            Other Exempt Offerings
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'exemptOfferings')}><small>+ Add New Other Exempt Offering</small></Link>
          </Header>
          <p>Describe any past fund raises in the last 3 years.</p>
          {
            GENERAL_FRM.fields.exemptOfferings.map((offering, index) => (
              <Aux>
                <Header as="h6">{`Other Exempt Offering ${index + 1}`}
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'exemptOfferings')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Header>
                <div className="featured-section">
                  <Form.Group widths={2}>
                    {
                      ['dateOfOffering', 'securitiesExemption', 'securitiesOffered'].map(field => (
                        <FormInput
                          hoverable={field === 'securitiesExemptionReliedUpon'}
                          key={field}
                          name={field}
                          fielddata={offering[field]}
                          changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                        />
                      ))
                    }
                    <MaskedInput
                      name="amountSold"
                      fielddata={offering.amountSold}
                      changed={(values, name) => maskArrayChange(values, formName, name, 'exemptOfferings', index)}
                      number
                    />
                  </Form.Group >
                  <FormTextarea
                    name="useOfProceeds"
                    fielddata={offering.useOfProceeds}
                    changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                    containerclassname="secondary"
                  />
                </div>
              </Aux>
            ))
          }
          <Divider section />
          {/* <Button size="small" color="blue" className="link-button" onClick={e => this.addMore
          (e, formName, 'exemptOfferings')}>+ Add New Other Exempt Offering</Button> */}
          <Header as="h4">
            Material Terms of any Indebteness
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'materialIndebtedness')}><small>+ Add New Term</small></Link>
          </Header>
          {
            GENERAL_FRM.fields.materialIndebtedness.map((terms, index) => (
              <Aux>
                <Header as="h6">{`Term ${index + 1}`}
                  <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'materialIndebtedness')} >
                    <Icon className="ns-close-circle" color="grey" />
                  </Link>
                </Header>
                <div className="featured-section">
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
                          changed={(values, name) => maskArrayChange(values, formName, name, 'materialIndebtedness', index)}
                          percentage={field === 'interestRate'}
                          currency={field === 'amountOutstanding'}
                          prefix={field === 'amountOutstanding' ? '$' : ''}
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
                </div>
              </Aux>
            ))
          }
          <Divider section />
          {/* <Button size="small" color="blue" className="link-button" onClick={e => this.
          addMore(e, formName, 'materialIndebtedness')}>+ Add New Term</Button> */}
          <Header as="h4">
            Affiliated Party Transactions
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'affiliatedTransactions')}><small>+ Add New Affiliated Party</small></Link>
          </Header>
          <p>In the past year (and looking forward),
            has the business entered into any transactions with affiliated parties
            (i.e., affiliated entities, directors or relatives)?
          </p>
          {
          GENERAL_FRM.fields.affiliatedTransactions.map((transaction, index) => (
            <Aux>
              <Header as="h6">{`Transaction ${index + 1}`}
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'affiliatedTransactions')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
              </Header>
              <div className="featured-section">
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
                    changed={(values, name) => maskArrayChange(values, formName, name, 'affiliatedTransactions', index)}
                  />
                </Form.Group >
                <FormTextarea
                  name="description"
                  fielddata={transaction.description}
                  changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  containerclassname="secondary"
                />
              </div>
            </Aux>
          ))
          }
          <Divider hidden />
          {access.asManager &&
            <div className="clearfix mb-20">
              <Button as="span" className="time-stamp">
                <Icon className="ns-check-circle" color="green" />
                Submitted by ISSUER_NAME on 2/3/2018
              </Button>
              <Button.Group floated="right">
                <Button inverted color="red" content="Decline" className="relaxed" />
                <Button color="green" content="Approve" className="relaxed" />
              </Button.Group>
            </div>
          }
          <div className="clearfix">
            <Button as="span" className="time-stamp">
              <Icon className="ns-check-circle" color="green" />
              Approved by MANAGER_NAME on 2/3/2018
            </Button>
            <Button primary content="Save" floated="right" className="relaxed" disabled={!GENERAL_FRM.meta.isValid} />
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
      </div>
    );
  }
}
