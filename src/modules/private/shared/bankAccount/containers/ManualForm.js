import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Aux from 'react-aux';
import { Header, Form, Button, Message, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup } from '../../../../../theme/form';
import { validationActions } from '../../../../../services/actions';
import AddFunds from './AddFunds';
import LinkbankSummary from './LinkbankSummary';
import HtmlEditor from '../../../../../modules/shared/HtmlEditor';

@inject('individualAccountStore', 'bankAccountStore', 'accountStore', 'uiStore', 'entityAccountStore', 'iraAccountStore', 'transactionStore')
@withRouter
@observer
export default class ManualForm extends Component {
  componentWillMount() {
    // this.props.bankAccountStore.setIsManualLinkBankSubmitted();
    this.props.bankAccountStore.setShouldValidateAmount();
    this.props.uiStore.clearErrors();
  }
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.resetAddFundsForm();
    this.props.bankAccountStore.setIsManualLinkBankSubmitted();
    const { investmentAccType } = this.props.accountStore;
    const accTypeStore = investmentAccType === 'individual' ? 'individualAccountStore' : investmentAccType === 'entity' ? 'entityAccountStore' : investmentAccType === 'ira' ? 'iraAccountStore' : 'individualAccountStore';
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 3 } : { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 1 };
    if (this.props.action === 'change') {
      this.props.uiStore.setProgress();
      this.props.bankAccountStore.validateManualAccount(investmentAccType).then(() => {
        this.props.transactionStore.requestOtpForManageTransactions().then(() => {
          const confirmUrl = `${this.props.refLink}/confirm`;
          this.props.history.push(confirmUrl);
        });
      });
    } else {
      this.props[accTypeStore].createAccount(currentStep).then(() => {
        this.props[accTypeStore].setStepToBeRendered(currentStep.stepToBeRendered);
        this.props.bankAccountStore.resetRoutingNum();
        this.props.bankAccountStore.setLinkBankSummary();
      }).catch(console.log(e));
    }
  }

  linkAccountDirectly = () => {
    this.props.bankAccountStore.setBankLinkInterface('list');
    this.props.uiStore.clearErrors();
  }

  render() {
    const { errors, inProgress } = this.props.uiStore;
    const {
      showAddFunds,
      isEncrypted,
      formLinkBankManually,
      linkBankManuallyChange,
      accountTypeChange,
      linkbankSummary,
    }
      = this.props.bankAccountStore;
    if (showAddFunds) {
      return <AddFunds />;
    }
    if (this.props.action !== 'change' && linkbankSummary) {
      return <LinkbankSummary />;
    }
    if (this.props.action === 'change' && inProgress) {
      return (
        <Dimmer className="fullscreen" active={inProgress}>
          <Loader active={inProgress}>
          Please wait...
          </Loader>
        </Dimmer>);
    }
    const isAccNumberEncrypted = isEncrypted(formLinkBankManually.fields.accountNumber.value);
    return (
      <div className="center-align">
        <Header as="h3">Link bank manually</Header>
        <p>Enter your bank{"'"}s routing number and your checking account number.</p>
        <Form error={!!errors} onSubmit={this.handleSubmitForm}>
          <div className="field-wrap left-align">
            <MaskedInput
              name="accountNumber"
              fielddata={formLinkBankManually.fields.accountNumber}
              changed={linkBankManuallyChange}
              value={isAccNumberEncrypted ? '' : formLinkBankManually.fields.accountNumber.value}
              accountNumber
              showerror
            />
            <MaskedInput
              name="routingNumber"
              fielddata={formLinkBankManually.fields.routingNumber}
              changed={linkBankManuallyChange}
              value={isEncrypted(formLinkBankManually.fields.routingNumber.value) ? '' : formLinkBankManually.fields.routingNumber.value}
              routingNumber
              showerror
            />
            <Form.Field>
              <Aux>
                {
                  <FormRadioGroup
                    fielddata={formLinkBankManually.fields.accountType}
                    changed={accountTypeChange}
                    name="accountType"
                    value={formLinkBankManually.fields.value}
                  />
                }
              </Aux>
            </Form.Field>
          </div>
          {errors &&
            <Message error className="mb-30">
              <HtmlEditor readOnly content={errors.message ? errors.message.replace('GraphQL error: ', '') : ''} />              {/* <ListErrors errors={[errors.message]} /> */}
            </Message>
          }
          <Button primary size="large" className="relaxed" content="Confirm" disabled={!formLinkBankManually.meta.isValid} />
        </Form>
        <Button color="green" className="link-button mt-30" content="Or link account directly" onClick={this.linkAccountDirectly} />
      </div>
    );
  }
}
