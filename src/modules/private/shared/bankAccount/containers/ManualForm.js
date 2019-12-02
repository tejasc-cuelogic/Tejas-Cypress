import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup } from '../../../../../theme/form';
import { validationActions } from '../../../../../services/actions';
import AddFunds from './AddFunds';
import LinkbankSummary from './LinkbankSummary';
import HtmlEditor from '../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 768;

@inject('individualAccountStore', 'bankAccountStore', 'accountStore', 'uiStore', 'entityAccountStore', 'iraAccountStore', 'transactionStore')
@withRouter
@observer
export default class ManualForm extends Component {
  constructor(props) {
    super(props);
    // this.props.bankAccountStore.setIsManualLinkBankSubmitted();
    this.props.bankAccountStore.setShouldValidateAmount();
    this.props.uiStore.clearErrors();
    const modalEle = document.getElementById('multistep-modal');
    if (modalEle && isMobile) {
      modalEle.parentNode.scrollTo(0, 0);
    }
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.bankAccountStore.resetAddFundsForm();
    this.props.bankAccountStore.setIsManualLinkBankSubmitted();
    const { investmentAccType, ACC_TYPE_MAPPING, INVESTMENT_ACC_TYPES } = this.props.accountStore;
    const { store } = ACC_TYPE_MAPPING[INVESTMENT_ACC_TYPES.fields.accType.value];
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 6, linkBankStepValue: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 3, linkBankStepValue: 3 } : { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 1, linkBankStepValue: 0 };
    if (this.props.action === 'change') {
      this.props.uiStore.setProgress();
      this.props.bankAccountStore.validateManualAccount(investmentAccType).then(() => {
        this.props.transactionStore.requestOtpForManageTransactions(true).then(() => {
          const confirmUrl = `${this.props.refLink}/confirm`;
          this.props.history.push(confirmUrl);
        });
      });
    } else {
      store.createAccount(currentStep).then(() => {
        if (this.props.bankAccountStore.isAccountPresent) {
          this.props.bankAccountStore.resetRoutingNum();
          this.props.bankAccountStore.setIsManualLinkBankSubmitted(false);
          this.props.bankAccountStore.setBankLinkInterface('list');
        }
        store.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      }).catch(() => {
        store.setStepToBeRendered(this.props.accountStore.getStepValue(currentStep));
      });
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
    } = this.props.bankAccountStore;
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
        </Dimmer>
      );
    }
    const isAccNumberEncrypted = isEncrypted(formLinkBankManually.fields.accountNumber.value);
    return (
      <div className={isMobile ? '' : 'center-align'}>
        <Header as="h3">
        Enter your bank account and routing number
        </Header>
        <Form error={!!errors} onSubmit={this.handleSubmitForm}>
          <Form.Field className={isMobile ? 'mb-40' : 'mb-50'}>
            <>
              {
                <FormRadioGroup
                  fielddata={formLinkBankManually.fields.accountType}
                  changed={accountTypeChange}
                  name="accountType"
                  value={formLinkBankManually.fields.value}
                  containerclassname={`${isMobile ? 'horizontal' : ''} button-radio center-align`}
                />
              }
            </>
          </Form.Field>
          <div className={`${isMobile ? '' : 'field-wrap'} left-align`}>
            <MaskedInput
              name="accountNumber"
              fielddata={formLinkBankManually.fields.accountNumber}
              changed={linkBankManuallyChange}
              value={isAccNumberEncrypted ? '' : formLinkBankManually.fields.accountNumber.value}
              accountNumber
              className="fs-block"
              showerror
            />
            <MaskedInput
              name="routingNumber"
              fielddata={formLinkBankManually.fields.routingNumber}
              changed={linkBankManuallyChange}
              value={isEncrypted(formLinkBankManually.fields.routingNumber.value) ? '' : formLinkBankManually.fields.routingNumber.value}
              routingNumber
              className="fs-block"
              showerror
            />
          </div>
          {errors
            && (
            <p className="error mb-30">
              <HtmlEditor readOnly content={errors.message ? errors.message.replace('GraphQL error: ', '') : ''} />
              {' '}
              {/* <ListErrors errors={[errors.message]} /> */}
            </p>
            )
          }
          <Button primary size="large" fluid={isMobile} className={`${isMobile ? 'mt-30' : ''} relaxed`} content="Confirm" disabled={!formLinkBankManually.meta.isValid || inProgress} />
        </Form>
        <div className="center-align">
          <Button color="green" className="link-button mt-30" content="Link bank account automatically" onClick={this.linkAccountDirectly} />
        </div>
      </div>
    );
  }
}
