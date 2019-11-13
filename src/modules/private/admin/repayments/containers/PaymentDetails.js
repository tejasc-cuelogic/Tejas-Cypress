import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormInput, FormDropDown, MaskedInput } from '../../../../../theme/form';
import { SECURITIES_VALUES } from '../../../../../services/constants/admin/offerings';

@inject('paymentStore', 'uiStore')
@withRouter
@observer
export default class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.props.paymentStore.getOfferingById(get(this.props, 'match.params.id'));
  }

  handleCloseModal = () => {
    this.props.history.push(this.props.refLink);
  }

  handleUpdatePayment = (id) => {
    const { updatePayment } = this.props.paymentStore;
    updatePayment(id)
      .then(() => {
        this.handleCloseModal();
      });
  }

  render() {
    const { PAYMENT_FRM, maskChange } = this.props.paymentStore;
    const { inProgress } = this.props.uiStore;
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
                readOnly
                containerclassname="display-only"
                prefix="$ "
                currency
                type="text"
                name="sinkingFundBalance"
                fielddata={PAYMENT_FRM.fields.sinkingFundBalance}
              />
            </Form.Group>
            <div className="center-align mt-20">
              <Button className="very relaxed red" content="Cancel" onClick={this.handleCloseModal} />
              <Button primary className="very relaxed" disabled={!PAYMENT_FRM.meta.isValid} loading={inProgress} content="Save" onClick={() => this.handleUpdatePayment(get(this.props, 'match.params.id'))} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
