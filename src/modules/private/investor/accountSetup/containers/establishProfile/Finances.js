import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup } from '../../../../../../theme/form';
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
      INVESTOR_PROFILE_FORM,
      financesChange,
      canSubmitFieldsForm,
      chkboxTicked,
      financesInputChange,
      investorProfileChange,
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
        <Header as="h3" textAlign="center">Financial Information</Header>
        <p className="center-align mb-50">
          Provide your financial information to access the right investments for you.
          Your information is encrypted and securely transmitted.
        </p>
        <Form error>
          <FormRadioGroup
            fielddata={INVESTOR_PROFILE_FORM.fields.investorProfileType}
            name="investorProfileType"
            changed={investorProfileChange}
            containerclassname="button-radio center-align mb-50"
          />
          {/* <MaskedInput
            name="netWorth"
            currency
            fielddata={FINANCES_FORM.fields.netWorth}
            changed={financesChange}
            prefix="$ "
          /> */}
          <Form.Group widths="equal">
            {['netWorth', 'annualIncomeThirdLastYear'].map(field => (
              <MaskedInput
                type="tel"
                key={field}
                name={field}
                currency
                fielddata={FINANCES_FORM.fields[field]}
                changed={financesChange}
                prefix="$ "
                showerror
              />
            ))
            }
          </Form.Group>
          <Form.Group widths="equal">
            {['annualIncomeLastYear', 'annualIncomeCurrentYear'].map(field => (
              <MaskedInput
                type="tel"
                key={field}
                name={field}
                currency
                fielddata={FINANCES_FORM.fields[field]}
                changed={financesChange}
                prefix="$ "
                showerror
              />
            ))
            }
          </Form.Group>
          {/* <FormCheckbox
            fielddata={FINANCES_FORM.fields.checkbox1}
            name="checkbox1"
            changed={this.handleTick}
            defaults
          />
          { FINANCES_FORM.fields.directorShareHolderOfCompany.value ?
            <p style={{ paddingLeft: '30px', marginTop: '5px' }}>
              The name of the company is{' '}
              <span style={{ textDecoration: 'underline' }}>
              {FINANCES_FORM.fields.directorShareHolderOfCompany.value}</span>
            </p>
            : <p />
          }
          <FormCheckbox
            fielddata={FINANCES_FORM.fields.checkbox2}
            name="checkbox2"
            changed={this.handleTick}
            defaults
          />
          { FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value ?
            <p style={{ paddingLeft: '30px', marginTop: '5px' }}>
              The name of firm is{' '}
              <span style={{ textDecoration: 'underline' }}>
              {FINANCES_FORM.fields.employedOrAssoWithFINRAFirmName.value}</span>
            </p>
          : <p />
          } */}
        </Form>
      </div>
    );
  }
}
