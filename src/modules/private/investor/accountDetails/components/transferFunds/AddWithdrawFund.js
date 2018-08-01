import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Modal, Button, Header, Form, Divider } from 'semantic-ui-react';
import { FormInput } from '../../../../../../theme/form';
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
  render() {
    const {
      match, location, transactionStore,
    } = this.props;
    const { TRANSFER_FRM, TransferChange } = transactionStore;
    return (
      <Modal dimmer open size="mini" closeIcon onClose={this.goBack} className="reward-modal">
        <Modal.Header>
          <Header as="h3"><AccTypeTitle noText /> {(match.params.action === 'add' ? 'Add' : 'Withdraw')} funds</Header>
        </Modal.Header>
        <Modal.Content>
          <Header as="h6">
            <Header.Subheader>Bank account</Header.Subheader>
            Bank of America ...7545 <Link to={location}>Change</Link>
          </Header>
          <Form error onSubmit={this.handleSubmitForm}>
            <FormInput
              key="amount"
              type="text"
              name="amount"
              label={`Amount you want to ${(match.params.action === 'add' ? 'deposit' : 'withdraw')}`}
              fielddata={TRANSFER_FRM.fields.amount}
              changed={TransferChange}
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
