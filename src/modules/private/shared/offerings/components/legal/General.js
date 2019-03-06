import React, { Component } from 'react';
import Aux from 'react-aux';
import { inject, observer } from 'mobx-react';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { Form, Header, Icon, Confirm, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput, FormTextarea } from '../../../../../../theme/form';
import ButtonGroup from '../ButtonGroup';
@inject('offeringCreationStore', 'userStore', 'offeringsStore')
@observer
export default class General extends Component {
  componentWillMount() {
    this.props.offeringCreationStore.setFormData('GENERAL_FRM', 'legal.general');
    this.props.offeringCreationStore.setFormData('RISK_FACTORS_FRM', 'legal.riskFactors');
    if (!this.props.offeringCreationStore.initLoad.includes('DOCUMENTATION_FRM')) {
      this.props.offeringCreationStore.setFormData('DOCUMENTATION_FRM', 'legal.documentation.issuer');
    }
  }
  addMore = (e, formName, arrayName) => {
    e.preventDefault();
    this.props.offeringCreationStore.addMore(formName, arrayName);
  }
  toggleConfirmModal = (e, index, formName) => {
    e.preventDefault();
    this.props.offeringCreationStore.toggleConfirmModal(index, formName);
  }
  handleFormSubmit = (isApproved = null) => {
    const { GENERAL_FRM, updateOffering, currentOfferingId } = this.props.offeringCreationStore;
    updateOffering(currentOfferingId, GENERAL_FRM.fields, 'legal', 'general', true, undefined, isApproved);
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
    const { offer } = this.props.offeringsStore;
    const formName = 'GENERAL_FRM';
    const shorthandBusinessName = get(offer, 'keyTerms.shorthandBusinessName') || '';
    const minOfferingAmount = get(offer, 'keyTerms.minOfferingAmount') || '';
    const maxOfferingAmount = get(offer, 'keyTerms.maxOfferingAmount') || '';
    const { isIssuer } = this.props.userStore;
    const { match } = this.props;
    const access = this.props.userStore.myAccessForModule('OFFERINGS');
    const isManager = access.asManager;
    const submitted = (offer && offer.legal && offer.legal.general &&
      offer.legal.general.submitted) ? offer.legal.general.submitted : null;
    const approved = (offer && offer.legal && offer.legal.general && offer.legal.general.approved) ?
      offer.legal.general.approved : null;
    const issuerSubmitted = (offer && offer.legal && offer.legal.general &&
      offer.legal.general.issuerSubmitted) ? offer.legal.general.issuerSubmitted : null;
    const isReadonly = ((isIssuer && issuerSubmitted) || (submitted && !isManager && !isIssuer) ||
      (isManager && approved && approved.status));
    return (
      <div className={!isIssuer || (isIssuer && match.url.includes('offering-creation')) ? '' : 'ui card fluid form-card'}>
        <Form>
          <Header as="h4">General Information</Header>
          <Form.Group widths={3}>
            {['websiteUrl', 'monthLaunch', 'offeringDeadline', 'employmentIdNumber'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={GENERAL_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            <MaskedInput
              displayMode={isReadonly}
              key="numOfEmployees"
              name="numOfEmployees"
              fielddata={GENERAL_FRM.fields.numOfEmployees}
              changed={(values, name) => maskArrayChange(values, formName, name)}
              number
            />
          </Form.Group>
          <Header as="h4">Contact</Header>
          <Form.Group widths={3}>
            {['businessStreet', 'businessCity', 'businessState'].map(field => (
              <FormInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={GENERAL_FRM.fields[field]}
                changed={(e, result) => formArrayChange(e, result, formName)}
              />
            ))}
            {['businessZip', 'number'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={GENERAL_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                zipCode={field === 'businessZip'}
                phoneNumber={field === 'number'}
                format={field === 'number' ? '###-###-####' : '#####'}
              />
            ))}
          </Form.Group >
          <Header as="h4">Banking</Header>
          <Form.Group widths={3}>
            <FormInput
              displayMode={isReadonly}
              name="bankName"
              fielddata={GENERAL_FRM.fields.bankName}
              changed={(e, result) => formArrayChange(e, result, formName)}
            />
            {['bankRoutingNumber', 'accountNumber'].map(field => (
              <MaskedInput
                displayMode={isReadonly}
                key={field}
                name={field}
                fielddata={GENERAL_FRM.fields[field]}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                accountNumber={field === 'accountNumber'}
                routingNumber={field === 'bankRoutingNumber'}
              />
            ))}
          </Form.Group >
          <Divider section />
          <Header as="h4">Business Capitalization</Header>
          <p>{GENERAL_FRM.fields.businessCapitalization.label}</p>
          <FormTextarea
            readOnly={isReadonly}
            name="businessCapitalization"
            fielddata={GENERAL_FRM.fields.businessCapitalization}
            changed={(e, result) => formArrayChange(e, result, formName)}
            containerclassname="secondary"
            defaultValue={`Because ${shorthandBusinessName} was formed recently, the Issuer’s operations are limited and there are no historical results of operation to report.  The Issuer anticipates that the total cost of the project will be approximately $[X]. ${shorthandBusinessName} is seeking to crowdfund an amount between the minimum of ${minOfferingAmount ? `$${minOfferingAmount}` : ''} and maximum of ${maxOfferingAmount ? `$${maxOfferingAmount}` : ''} through the Offering. ${shorthandBusinessName} has also raised $[x] through sale of equity interests. If ${shorthandBusinessName} is able to complete a successful Offering, the members of the Issuer have committed to provide or arrange for sufficient financing for the Issuer to cover the remaining balance of the project cost. Please also see Section V – “Financial Statements” and Appendix A for more information.`}
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
            <Aux>
              {/* <MaskedInput
                displayMode={isReadonly}
                name="minOfferingExpenseAmount"
                fielddata={GENERAL_FRM.fields.minOfferingExpenseAmount}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                currency
                prefix="$"
              /> */}
              <FormTextarea
                readOnly={isReadonly}
                name="minOfferingExpenseAmountDescription"
                fielddata={GENERAL_FRM.fields.minOfferingExpenseAmountDescription}
                changed={(e, result) => formArrayChange(e, result, formName)}
                containerclassname="secondary"
              />
              {/* <MaskedInput
                displayMode={isReadonly}
                name="maxOfferingExpenseAmount"
                fielddata={GENERAL_FRM.fields.maxOfferingExpenseAmount}
                changed={(values, name) => maskArrayChange(values, formName, name)}
                currency
                prefix="$"
              /> */}
              <FormTextarea
                readOnly={isReadonly}
                name="maxOfferingExpenseAmountDescription"
                fielddata={GENERAL_FRM.fields.maxOfferingExpenseAmountDescription}
                changed={(e, result) => formArrayChange(e, result, formName)}
                containerclassname="secondary"
              />
            </Aux>
          }
          <Divider section />
          <Header as="h4">Describe Rights of Your Equity Shareholders</Header>
          <p>{GENERAL_FRM.fields.equityShareholderRights.label}</p>
          <FormTextarea
            readOnly={isReadonly}
            name="equityShareholderRights"
            fielddata={GENERAL_FRM.fields.equityShareholderRights}
            changed={(e, result) => formArrayChange(e, result, formName)}
            containerclassname="secondary"
            hidelabel
          />
          <Divider section />
          <Header as="h4">
            Existing Securities
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'security')}><small>+ Add New Security</small></Link>
            }
          </Header>
          {GENERAL_FRM.fields.security.map((security, index) => (
            <Aux>
              <Header as="h6">{`Security ${index + 1}`}
                {!isReadonly && GENERAL_FRM.fields.security.length > 1 &&
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'security')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                }
              </Header>
              <div className="featured-section">
                <Form.Group widths={2}>
                  {['class', 'votingRights', 'securitiesAuthorized', 'securitiesOutstanding'].map(field => (
                    <FormInput
                      displayMode={isReadonly}
                      key={field}
                      name={field}
                      fielddata={security[field]}
                      changed={(e, result) => formArrayChange(e, result, formName, 'security', index)}
                    />
                  ))}
                </Form.Group >
                <FormInput
                  displayMode={isReadonly}
                  name="limitDiluteQualify"
                  fielddata={security.limitDiluteQualify}
                  changed={(e, result) => formArrayChange(e, result, formName, 'security', index)}
                />
              </div>
            </Aux>
          ))}
          <Divider section />
          {/* <Button size="small" color="blue" className="link-button" onClick={e =>
            this.addMore(e, formName, 'security')}>+ Add New Security</Button> */}
          <Header as="h4">
            Other Exempt Offerings
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'exemptOfferings')}><small>+ Add New Other Exempt Offering</small></Link>
            }
          </Header>
          <p>Describe any past fund raises in the last 3 years.</p>
          {GENERAL_FRM.fields.exemptOfferings.map((offering, index) => (
            <Aux>
              <Header as="h6">{`Other Exempt Offering ${index + 1}`}
                {!isReadonly && GENERAL_FRM.fields.exemptOfferings.length > 1 &&
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'exemptOfferings')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                }
              </Header>
              <div className="featured-section">
                <Form.Group widths={2}>
                  {['dateOfOffering', 'securitiesExemption', 'securitiesOffered'].map(field => (
                    <FormInput
                      displayMode={isReadonly}
                      hoverable={field === 'securitiesExemption'}
                      key={field}
                      name={field}
                      fielddata={offering[field]}
                      changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                    />
                  ))}
                  <MaskedInput
                    displayMode={isReadonly}
                    name="amountSold"
                    fielddata={offering.amountSold}
                    changed={(values, name) => maskArrayChange(values, formName, name, 'exemptOfferings', index)}
                    number
                  />
                </Form.Group >
                <FormTextarea
                  readOnly={isReadonly}
                  name="useOfProceeds"
                  fielddata={offering.useOfProceeds}
                  changed={(e, result) => formArrayChange(e, result, formName, 'exemptOfferings', index)}
                  containerclassname="secondary"
                />
              </div>
            </Aux>
          ))}
          <Divider section />
          {/* <Button size="small" color="blue" className="link-button" onClick={e => this.addMore
          (e, formName, 'exemptOfferings')}>+ Add New Other Exempt Offering</Button> */}
          <Header as="h4">
            Material Terms of any Indebteness
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'materialIndebtedness')}><small>+ Add New Term</small></Link>
            }
          </Header>
          {GENERAL_FRM.fields.materialIndebtedness.map((terms, index) => (
            <Aux>
              <Header as="h6">{`Term ${index + 1}`}
                {!isReadonly && GENERAL_FRM.fields.materialIndebtedness.length > 1 &&
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'materialIndebtedness')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                }
              </Header>
              <div className="featured-section">
                <FormInput
                  displayMode={isReadonly}
                  name="creditorName"
                  fielddata={terms.creditorName}
                  changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                />
                <Form.Group widths={2}>
                  {['amountOutstanding', 'interestRate', 'maturityDate'].map(field => (
                    <MaskedInput
                      displayMode={isReadonly}
                      key={field}
                      name={field}
                      fielddata={terms[field]}
                      changed={(values, name) => maskArrayChange(values, formName, name, 'materialIndebtedness', index)}
                      percentage={field === 'interestRate'}
                      maxlength={field === 'interestRate' && 8}
                      currency={field === 'amountOutstanding'}
                      prefix={field === 'amountOutstanding' ? '$' : ''}
                      dateOfBirth={field === 'maturityDate'}
                    />
                  ))}
                  <FormInput
                    displayMode={isReadonly}
                    name="paymentSchedule"
                    fielddata={terms.paymentSchedule}
                    changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                  />
                </Form.Group >
                <FormTextarea
                  readOnly={isReadonly}
                  name="otherTerms"
                  fielddata={terms.otherTerms}
                  changed={(e, result) => formArrayChange(e, result, formName, 'materialIndebtedness', index)}
                  containerclassname="secondary"
                />
              </div>
            </Aux>
          ))}
          <Divider section />
          <Header as="h4">
            Affiliated Party Transactions
            {!isReadonly &&
            <Link to={this.props.match.url} className="link" onClick={e => this.addMore(e, formName, 'affiliatedTransactions')}><small>+ Add New Affiliated Party</small></Link>
            }
          </Header>
          <p>In the past year (and looking forward),
            has the business entered into any transactions with affiliated parties
            (i.e., affiliated entities, directors or relatives)?
          </p>
          {GENERAL_FRM.fields.affiliatedTransactions.map((transaction, index) => (
            <Aux>
              <Header as="h6">{`Transaction ${index + 1}`}
                {!isReadonly && GENERAL_FRM.fields.affiliatedTransactions.length > 1 &&
                <Link to={this.props.match.url} className="link" onClick={e => this.toggleConfirmModal(e, index, 'affiliatedTransactions')} >
                  <Icon className="ns-close-circle" color="grey" />
                </Link>
                }
              </Header>
              <div className="featured-section">
                <FormInput
                  displayMode={isReadonly}
                  name="name"
                  fielddata={transaction.name}
                  changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                />
                <Form.Group widths={2}>
                  <FormInput
                    displayMode={isReadonly}
                    name="relationship"
                    fielddata={transaction.relationship}
                    changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  />
                  <MaskedInput
                    displayMode={isReadonly}
                    currency
                    prefix="$"
                    name="amountTransaction"
                    fielddata={transaction.amountTransaction}
                    changed={(values, name) => maskArrayChange(values, formName, name, 'affiliatedTransactions', index)}
                  />
                </Form.Group >
                <FormTextarea
                  readOnly={isReadonly}
                  name="description"
                  fielddata={transaction.description}
                  changed={(e, result) => formArrayChange(e, result, formName, 'affiliatedTransactions', index)}
                  containerclassname="secondary"
                />
              </div>
            </Aux>
          ))}
          <Divider hidden />
          <ButtonGroup
            isIssuer={isIssuer}
            submitted={submitted}
            isManager={isManager}
            formValid={GENERAL_FRM.meta.isValid}
            approved={approved}
            updateOffer={this.handleFormSubmit}
            issuerSubmitted={issuerSubmitted}
          />
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
