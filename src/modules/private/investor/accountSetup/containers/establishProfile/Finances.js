import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';
@inject('investorProfileStore', 'uiStore')
@withRouter
@observer
export default class Finances extends Component {
  render() {
    const {
      FINANCES_FORM,
      financesChange,
      investorProfileChange,
    } = this.props.investorProfileStore;
    const { errors } = this.props.uiStore;
    return (
      <div className="center-align">
        <Header as="h3">Financial Information</Header>
        <p className="mb-40">
          Provide your financial information to access the right investments for you.
          Your information is encrypted and securely transmitted.
        </p>
        {errors &&
        <Message error textAlign="left">
          <ListErrors errors={errors.message ? [errors.message] : [errors]} />
        </Message>
        }
        <Form error>
          <FormRadioGroup
            fielddata={FINANCES_FORM.fields.investorProfileType}
            name="investorProfileType"
            changed={investorProfileChange}
            containerclassname="button-radio center-align"
            classname="center-align"
            showerror
          />
          <div className="field-wrap left-align">
            <Form.Group widths={2}>
              {['netWorth', 'annualIncomeThirdLastYear', 'annualIncomeLastYear', 'annualIncomeCurrentYear'].map(field => (
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
              ))}
            </Form.Group>
          </div>
        </Form>
      </div>
    );
  }
}
