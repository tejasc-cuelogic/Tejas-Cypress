import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Header, Button, Form, Checkbox, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormTextarea } from '../../../../../../../theme/form';
import { ListErrors } from '../../../../../../../theme/shared';

@inject('transactionStore', 'uiStore')
@withRouter
@observer
export default class AddWithdrawFunds extends Component {
  constructor(props) {
    super(props);
    this.props.transactionStore.resetAddWithdrawFunds();
  }

  handleBack = () => {
    this.props.history.push(`${this.props.refLink}`);
  }

  handleAddWithdrawFundCta = (userId, accountId, actionType) => {
    this.props.transactionStore.addWithdrawFunds(userId, accountId, actionType).then(() => {
      this.handleBack();
    });
  }

  render() {
    const { inProgress, checkedChange, formChange, ADD_WITHDRAW_FUND_FRM } = this.props.transactionStore;
    const actionValue = this.props.match.params.action;
    const { userId, accountId } = this.props;
    const { errors } = this.props.uiStore;
    return (
      <Modal open closeOnDimmerClick={false} closeIcon onClose={this.handleBack} size="mini">
        <Modal.Header className="signup-header">
          <Header textAlign="center" as="h3">{actionValue === 'addfunds' ? 'Add' : 'Withdraw'} Funds</Header>
        </Modal.Header>
        <Modal.Content>
          <Form error={errors}>
            <MaskedInput
              hoverable
              prefix="$ "
              name="amount"
              // containerclassname="fund-amount"
              currency
              allowNegative={false}
              fielddata={ADD_WITHDRAW_FUND_FRM.fields.amount}
              changed={(values, field) => formChange(values, field, 'ADD_WITHDRAW_FUND_FRM', true)}
            />
            <FormTextarea
              containerclassname="secondary"
              name="description"
              fielddata={ADD_WITHDRAW_FUND_FRM.fields.description}
              changed={(e, result) => formChange(result.value, result.name, 'ADD_WITHDRAW_FUND_FRM')}
            />
            <Checkbox
              className="field"
              label="Agreement ID"
              checked={ADD_WITHDRAW_FUND_FRM.fields.showAgreementId.value}
              onChange={() => checkedChange(!ADD_WITHDRAW_FUND_FRM.fields.showAgreementId.value, 'showAgreementId', 'ADD_WITHDRAW_FUND_FRM')}
            />
            <Checkbox
              className="field ml-10"
              label={ADD_WITHDRAW_FUND_FRM.fields.sendInvestorNotification.label}
              name="sendInvestorNotification"
              checked={ADD_WITHDRAW_FUND_FRM.fields.sendInvestorNotification.value}
              onChange={() => checkedChange(!ADD_WITHDRAW_FUND_FRM.fields.sendInvestorNotification.value, 'sendInvestorNotification', 'ADD_WITHDRAW_FUND_FRM')}
            />
            {ADD_WITHDRAW_FUND_FRM.fields.showAgreementId.value
              && (
                <MaskedInput
                  name="agreementId"
                  number
                  fielddata={ADD_WITHDRAW_FUND_FRM.fields.agreementId}
                  changed={(values, field) => formChange(values, field, 'ADD_WITHDRAW_FUND_FRM', true)}
                />
              )
            }
            {errors
              && (
                <Message error className="mt-30">
                  <ListErrors errors={[errors]} />
                </Message>
              )
            }
            <div className="center-align mt-30">
              <Button disabled={!ADD_WITHDRAW_FUND_FRM.meta.isValid} className="primary relaxed" content="Submit" loading={inProgress.includes(actionValue)} onClick={() => this.handleAddWithdrawFundCta(userId, accountId, actionValue)} />
            </div>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}
