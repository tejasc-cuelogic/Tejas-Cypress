import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../theme/form';
import { AccTypeTitle } from '../../../../../../theme/shared';
import Helper from '../../../../../../helper/utility';

@inject('transactionStore')
@observer
export default class AddWithdrawFund extends Component {
  goBack = () => this.props.history.replace(this.props.refLink);
  transfer = () => {
    this.props.transactionStore.transact(
      this.props.transactionStore.TRANSFER_FRM.fields.amount.value,
      this.props.match.params.action,
    );
    Helper.toast('Transaction successful.', 'success');
    this.goBack();
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    // const { addFunds } = this.props.transactionStore;
    // addFunds();
  }
  render() {
    const {
      match, location, transactionStore,
    } = this.props;
    const { TRANSFER_FRM, TransferChange } = transactionStore;
    return (
      <Modal dimmer open size="mini" closeIcon onClose={this.goBack} closeOnDimmerClick={false} className="reward-modal">
        <Modal.Header>
          <Header as="h3"><AccTypeTitle noText /> {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds</Header>
        </Modal.Header>
        <Modal.Content>
          <Header as="h6" className="mb-30">
            <Header.Subheader>Bank account</Header.Subheader>
            Bank of America ...7545 <Link to={location}>Change</Link>
          </Header>
          <Form error onSubmit={this.handleSubmitForm}>
            <MaskedInput
              hoverable
              key="amount"
              prefix="$ "
              name="amount"
              currency
              value={TRANSFER_FRM.fields.amount}
              fielddata={TRANSFER_FRM.fields.amount}
              changed={(values, field) => TransferChange(values, field, 'TRANSFER_FRM')}
            />
            <Divider hidden />
            <div className="center-align">
              <Button
                disabled={!TRANSFER_FRM.meta.isValid}
                primary
                size="large"
                onClick={this.transfer}
                className="very relaxed"
              >
                {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds
              </Button>
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
