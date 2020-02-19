import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormInput, FormDropDown, MaskedInput, FormTextarea, FormRadioGroup } from '../../../../../theme/form';
import { SECURITIES_VALUES } from '../../../../../services/constants/admin/offerings';

@inject('paymentStore', 'uiStore')
@withRouter
@observer
export default class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.props.paymentStore.getOfferingBySlug(get(this.props, 'match.params.offeringSlug'));
  }

  handleCloseModal = () => {
    const { paymentType } = this.props.match.params;
    this.props.history.push(paymentType ? `${this.props.refLink}/${paymentType}` : this.props.refLink);
  }

  handleUpdatePayment = () => {
    const { paymentType } = this.props.match.params;
    const { updatePayment } = this.props.paymentStore;
    updatePayment(paymentType)
      .then(() => {
        this.handleCloseModal();
      });
  }

  calculateFormula = (type, key) => {
    const { calculateFormula, PAYMENT_FRM } = this.props.paymentStore;
    calculateFormula(
      type,
      key,
      {
        hardCloseDate: PAYMENT_FRM.fields.hardCloseDate.value,
        startupPeriod: PAYMENT_FRM.fields.startupPeriod.value,
        actualOpeningDate: PAYMENT_FRM.fields.operationsDate.value,
        anticipatedOpenDate: PAYMENT_FRM.fields.anticipatedOpenDate.value,
      },
      true,
    );
  }

  render() {
    const { PAYMENT_FRM, maskChange, formChange, selectedOffering, calculateDraftDate } = this.props.paymentStore;
    const { inProgress } = this.props.uiStore;
    const { paymentType } = this.props.match.params;
    const security = get(selectedOffering, 'offering.keyTerms.securities');
    const formMeta = ['REVENUE_SHARING_NOTE'].includes(security) ? ['anticipatedOpenDate', 'paymentStartDateCalc', 'operationsDate', 'minPaymentStartDateCalc'] : ['paymentStartDateCalc'];
    const amountDue = (
      <MaskedInput
        prefix="$ "
        currency
        type="text"
        name="amountDue"
        changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM')}
        fielddata={PAYMENT_FRM.fields.amountDue}
      />
    );
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Edit Payment</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
          <Form>
            <Form.Group widths="2">
              <FormInput
                displayMode
                fluid
                type="text"
                name="shorthandBusinessName"
                fielddata={PAYMENT_FRM.fields.shorthandBusinessName}
              />
              {['tracker'].includes(paymentType)
              && (
              <>
                {
                ['hardCloseDate'].map(field => (
                  <MaskedInput
                    displayMode
                    name={field}
                    placeHolder={PAYMENT_FRM.fields[field].placeHolder}
                    fielddata={PAYMENT_FRM.fields[field]}
                    changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'formatted')}
                    dateOfBirth
                  />
                ))
                }
              <MaskedInput
                number
                name="startupPeriod"
                changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'float')}
                fielddata={PAYMENT_FRM.fields.startupPeriod}
                onkeyup={() => this.calculateFormula(security, 'startupPeriod')}
              />
              {['REVENUE_SHARING_NOTE'].includes(security) && amountDue}
              {formMeta.map(field => (
                <MaskedInput
                  displayMode={['paymentStartDateCalc', 'minPaymentStartDateCalc'].includes(field)}
                  format={['paymentStartDateCalc', 'minPaymentStartDateCalc'].includes(field) ? '##/####' : '##/##/####'}
                  name={field}
                  label={field === 'operationsDate' ? 'Actual Opening Date' : false}
                  placeHolder={field === 'operationsDate' ? 'Actual Opening Date' : PAYMENT_FRM.fields[field].placeHolder}
                  fielddata={PAYMENT_FRM.fields[field]}
                  changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'formatted')}
                  onkeyup={() => this.calculateFormula(security, field)}
                  dateOfBirth
                />
              ))}
              {['inDefault', 'sendNotification'].map(field => (
              <div className="field">
                <Header as="label">{PAYMENT_FRM.fields[field].label}</Header>
                <FormRadioGroup
                  fielddata={PAYMENT_FRM.fields[field]}
                  name={field}
                  changed={(e, result) => formChange(e, result, 'PAYMENT_FRM')}
                />
              </div>
              ))}
              <MaskedInput
                number
                name="draftDay"
                placeHolder={PAYMENT_FRM.fields.draftDay.placeHolder}
                fielddata={PAYMENT_FRM.fields.draftDay}
                changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'float')}
                onkeyup={calculateDraftDate}
              />
              <MaskedInput
                displayMode
                name="draftDate"
                placeHolder={PAYMENT_FRM.fields.draftDate.placeHolder}
                fielddata={PAYMENT_FRM.fields.draftDate}
                changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'formatted')}
                dateOfBirth
              />
              {['TERM_NOTE'].includes(security) && amountDue}
              </>
              )}
              {['issuers'].includes(paymentType)
              && (
              <>
              <FormDropDown
                displayMode
                fielddata={PAYMENT_FRM.fields.securities}
                selection
                value={PAYMENT_FRM.fields.securities.value}
                placeholder="Choose here"
                name="securities"
                options={SECURITIES_VALUES}
              />
              {
                ['maturityDate', 'hardCloseDate', 'expectedOpsDate', 'operationsDate', 'expectedPaymentDate', 'firstPaymentDate'].map(field => (
                  <MaskedInput
                    displayMode={['maturityDate', 'hardCloseDate'].includes(field)}
                    name={field}
                    placeHolder={PAYMENT_FRM.fields[field].placeHolder}
                    fielddata={PAYMENT_FRM.fields[field]}
                    changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM', 'formatted')}
                    dateOfBirth
                  />
                ))
              }
              <MaskedInput
                prefix="$ "
                currency
                type="text"
                name="monthlyPayment"
                changed={(values, name) => maskChange(values, name, 'PAYMENT_FRM')}
                fielddata={PAYMENT_FRM.fields.monthlyPayment}
              />
              <MaskedInput
                displayMode
                prefix="$ "
                currency
                type="text"
                name="sinkingFundBalance"
                fielddata={PAYMENT_FRM.fields.sinkingFundBalance}
              />
              </>
            )}
            </Form.Group>
            {['issuers'].includes(paymentType)
              && (
              <FormTextarea
                name="payments"
                fielddata={PAYMENT_FRM.fields.payments}
                changed={(e, result) => formChange(e, result, 'PAYMENT_FRM')}
                containerclassname="secondary"
              />
              )}
            <div className="center-align mt-20">
              <Button className="very relaxed red" content="Cancel" onClick={this.handleCloseModal} />
              <Button primary className="very relaxed" disabled={!PAYMENT_FRM.meta.isValid} loading={inProgress} content="Save" onClick={this.handleUpdatePayment} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
