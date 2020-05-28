import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Button, Dimmer, Loader } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup, FormInput } from '../../../../../theme/form';
import { validationActions } from '../../../../../services/actions';
import AddFunds from './AddFunds';
import LinkbankSummary from './LinkbankSummary';
import HtmlEditor from '../../../../shared/HtmlEditor';

const isMobile = document.documentElement.clientWidth < 768;

@inject('individualAccountStore', 'bankAccountStore', 'accountStore', 'uiStore', 'entityAccountStore', 'iraAccountStore', 'identityStore')
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

  handleSubmitForm = async (e) => {
    e.preventDefault();
    this.props.bankAccountStore.resetAddFundsForm();
    this.props.bankAccountStore.setIsManualLinkBankSubmitted();
    const { investmentAccType, ACC_TYPE_MAPPING, INVESTMENT_ACC_TYPES } = this.props.accountStore;
    const { store } = ACC_TYPE_MAPPING[INVESTMENT_ACC_TYPES.fields.accType.value];
    const currentStep = investmentAccType === 'entity' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 6, linkBankStepValue: 5 } : investmentAccType === 'ira' ? { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 5, linkBankStepValue: 4 } : { name: 'Link bank', validate: validationActions.validateLinkBankForm, stepToBeRendered: 1, linkBankStepValue: 0 };
    if (this.props.action === 'change') {
      this.props.uiStore.setProgress();
      this.props.bankAccountStore.validateManualAccount(investmentAccType).then(async () => {
      const res = await this.props.identityStore.sendOtp('BANK_CHANGE', isMobile);
      if (res) {
        const confirmUrl = `${this.props.refLink}/confirm`;
        this.props.history.push(confirmUrl);
      }
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
      linkBankManualFormChange,
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
      <div>
        <Header as="h4">
          Enter your bank account and routing number
        </Header>
        <Form error={!!errors} data-cy="manual-form" onSubmit={this.handleSubmitForm}>
          <Form.Field className={isMobile ? 'mb-40' : 'mb-50'}>
            <>
              {
                <FormRadioGroup
                  fielddata={formLinkBankManually.fields.accountType}
                  changed={linkBankManualFormChange}
                  name="accountType"
                  value={formLinkBankManually.fields.value}
                  containerclassname={`${isMobile ? 'horizontal no-flex-wrap' : 'two wide'} button-radio`}
                />
              }
            </>
          </Form.Field>
          <div className="left-align">
            <MaskedInput
              name="accountNumber"
              type="tel"
              fielddata={formLinkBankManually.fields.accountNumber}
              changed={linkBankManuallyChange}
              value={isAccNumberEncrypted ? '' : formLinkBankManually.fields.accountNumber.value}
              accountNumber
              className="fs-block"
            />
            <MaskedInput
              name="routingNumber"
              type="tel"
              fielddata={formLinkBankManually.fields.routingNumber}
              changed={linkBankManuallyChange}
              value={isEncrypted(formLinkBankManually.fields.routingNumber.value) ? '' : formLinkBankManually.fields.routingNumber.value}
              routingNumber
              className="fs-block"
            />
            <FormInput
              name="bankName"
              type="text"
              fielddata={formLinkBankManually.fields.bankName}
              changed={linkBankManualFormChange}
              value={formLinkBankManually.fields.bankName.value}
              routingNumber
              className="fs-block"
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
          <Button primary size="large" fluid={isMobile} data-cy="manual-confirm" className="mt-30 relaxed" content="Confirm" disabled={!formLinkBankManually.meta.isValid || inProgress} />
        </Form>
        <div className={isMobile && 'center-align'}>
          <Button color="green" className="link-button mt-30" content="Link bank account automatically" onClick={this.linkAccountDirectly} />
        </div>
      </div>
    );
  }
}
