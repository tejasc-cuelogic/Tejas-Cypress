import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput2, FormCheckbox } from '../../../../../../theme/form';
import FieldsForm from '../../components/establishProfile/FieldsForm';

@inject('investorProfileStore', 'uiStore')
@withRouter
@observer
export default class Finances extends Component {
  handleCloseNestedModal = () => {
    this.props.uiStore.setModalStatus(false);
    this.props.investorProfileStore.resetData(this.props.investorProfileStore.chkboxTicked);
  }
  handleFormSubmit = () => {
    this.props.investorProfileStore.submitFieldsForm();
    this.props.uiStore.setModalStatus(false);
  }

  handleTick = (e, values) => {
    if (this.props.investorProfileStore.FINANCES_FORM.fields[values.name].value[0]) {
      this.props.investorProfileStore.resetData(values.name);
    } else {
      this.props.investorProfileStore.setchkBoxTicked(values.name);
      this.props.uiStore.setModalStatus(true);
    }
  }

  render() {
    const {
      FINANCES_FORM,
      financesChange,
      canSubmitFieldsForm,
      chkboxTicked,
      financesInputChange,
    } = this.props.investorProfileStore;
    const { modalStatus } = this.props.uiStore;
    return (
      <div>
        <FieldsForm
          canSubmitFieldsForm={canSubmitFieldsForm}
          close={this.handleCloseNestedModal}
          handleFormSubmit={this.handleFormSubmit}
          financesChange={financesInputChange}
          chkboxTicked={chkboxTicked}
          modalStatus={modalStatus}
          form={FINANCES_FORM}
          {...this.props}
        />
        <Header as="h1" textAlign="center">
          Financial Information
        </Header>
        <Header as="h4" textAlign="center">
          Please provide the following information so that
          we can determine which investments we are allowed to show you
        </Header>
        <Form error>
          <MaskedInput2
            name="netWorth"
            currency
            fielddata={FINANCES_FORM.fields.netWorth}
            changed={financesChange}
            prefix="$ "
          />
          <Form.Group widths="equal">
            {['annualIncomeThirdLastYear', 'annualIncomeLastYear', 'annualIncomeCurrentYear'].map(field => (
              <MaskedInput2
                type="tel"
                key={field}
                name={field}
                currency
                fielddata={FINANCES_FORM.fields[field]}
                changed={financesChange}
                prefix="$ "
              />
            ))
            }
          </Form.Group>
          <FormCheckbox
            fielddata={FINANCES_FORM.fields.checkbox1}
            name="checkbox1"
            changed={this.handleTick}
            defaults
          />
          {FINANCES_FORM.fields.directorShareHolderOfCompany.value}
          <FormCheckbox
            fielddata={FINANCES_FORM.fields.checkbox2}
            name="checkbox2"
            changed={this.handleTick}
            defaults
          />
          {FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value}
        </Form>
      </div>
    );
  }
}
