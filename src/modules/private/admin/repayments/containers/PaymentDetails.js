import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Form, Button } from 'semantic-ui-react';
import { get } from 'lodash';
import { FormInput, FormDropDown, MaskedInput } from '../../../../../theme/form';
import { SECURITIES_VALUES } from '../../../../../services/constants/admin/offerings';
import { InlineLoader } from '../../../../../theme/shared';

@inject('paymentStore', 'uiStore')
@withRouter
@observer
export default class PaymentDetails extends Component {
  constructor(props) {
    super(props);
    this.props.paymentStore.getOfferingById(get(this.props, 'match.params.id'));
  }

  handleCloseModal = () => {
    this.props.history.push('/app/payments');
  }

  render() {
    const { PAYMENT_FRM, maskChange } = this.props.paymentStore;
    const { inProgress } = this.props.uiStore;
    if (inProgress) {
      return <InlineLoader />;
    }
    return (
      <Modal closeOnEscape={false} closeOnDimmerClick={false} size="mini" open closeIcon onClose={this.handleCloseModal} closeOnRootNodeClick={false}>
        <Modal.Header className="center-align signup-header">
          <Header as="h3">Edit Payment</Header>
        </Modal.Header>
        <Modal.Content className="signup-content">
            <Form>
              <FormInput
                disabled
                fluid
                type="text"
                name="shorthandBusinessName"
                fielddata={PAYMENT_FRM.fields.shorthandBusinessName}
              />
              <FormDropDown
                disabled
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
                    disabled={['maturityDate', 'hardCloseDate'].includes(field)}
                    name={field}
                    placeHolder={PAYMENT_FRM.fields[field].placeHolder}
                    fielddata={PAYMENT_FRM.fields[field]}
                    changed={(values, name) => maskChange(values, 'PAYMENT_FRM', name)}
                    dateOfBirth
                  />
                ))
              }
              <div className="center-align">
                <Button className="very relaxed red" content="Cancel" onClick={this.handleCloseModal} />
                <Button primary className="very relaxed" content="Submit" />
              </div>
            </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
