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
    if (this.props.investorProfileStore.FINANCES.fields[values.name].value[0]) {
      this.props.investorProfileStore.resetData(values.name);
    } else {
      this.props.investorProfileStore.setchkBoxTicked(values.name);
      this.props.uiStore.setModalStatus(true);
    }
  }

  render() {
    const {
      FINANCES,
      financesChange,
      canSubmitFieldsForm,
      chkboxTicked,
    } = this.props.investorProfileStore;
    const { modalStatus } = this.props.uiStore;
    return (
      <div>
        <FieldsForm
          canSubmitFieldsForm={canSubmitFieldsForm}
          close={this.handleCloseNestedModal}
          handleFormSubmit={this.handleFormSubmit}
          financesChange={financesChange}
          chkboxTicked={chkboxTicked}
          modalStatus={modalStatus}
          form={FINANCES}
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
            value={FINANCES.fields.netWorth.value}
            fielddata={FINANCES.fields.netWorth}
            changed={financesChange}
          />
          <Form.Group widths="equal">
            {['annualIncome1', 'annualIncome2', 'annualIncome3'].map(field => (
              <MaskedInput2
                key={field}
                name={field}
                currency
                value={FINANCES.fields[field].value}
                fielddata={FINANCES.fields[field]}
                changed={financesChange}
              />
            ))
            }
          </Form.Group>
          <FormCheckbox
            fielddata={FINANCES.fields.checkbox1}
            name="checkbox1"
            changed={this.handleTick}
            defaults
          />
          {FINANCES.fields.companyName.value}
          <FormCheckbox
            fielddata={FINANCES.fields.checkbox2}
            name="checkbox2"
            changed={this.handleTick}
            defaults
          />
          {FINANCES.fields.firmName.value}
        </Form>
      </div>
    );
  }
}
