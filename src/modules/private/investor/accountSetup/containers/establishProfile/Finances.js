import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider } from 'semantic-ui-react';
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
        <p className="tertiary-text">
          SEC rules and regulations require broker-dealers to collect income and net
          worth to determine investor suitability for private offerings.
        </p>
        <p className="tertiary-text">
          Select whether you are providing your information as an individual or as a couple.
        </p>
        <Divider hidden />
        <Form error>
          <FormRadioGroup
            fielddata={FINANCES_FORM.fields.investorProfileType}
            name="investorProfileType"
            changed={investorProfileChange}
            containerclassname="button-radio center-align"
            classname="center-align"
            showerror
          />
          <Divider hidden />
          <div className="field-wrap left-align">
            <Form.Group widths={2}>
              {['netWorth', 'annualIncomeCurrentYear'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  currency
                  fielddata={FINANCES_FORM.fields[field]}
                  changed={financesChange}
                  prefix="$ "
                  number
                  showerror
                  disableDecimal
                  maxlength={13}
                  allowNegative={false}
                />
              ))}
            </Form.Group>
          </div>
          {errors &&
          <Message error className="mt-30">
            <ListErrors errors={errors.message ? [errors.message] : [errors]} />
          </Message>
          }
        </Form>
      </div>
    );
  }
}
