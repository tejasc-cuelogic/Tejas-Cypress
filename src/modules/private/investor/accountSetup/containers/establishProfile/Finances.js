import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider, Button } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { MaskedInput, FormRadioGroup } from '../../../../../../theme/form';
import { ListErrors } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

@inject('investorProfileStore', 'uiStore')
@withRouter
@observer
export default class Finances extends Component {
  render() {
    const {
      FINANCES_FORM, stepToBeRendered,
      financesChange, investorProfileChange,
      updateInvestorProfileData,
    } = this.props.investorProfileStore;
    const { errors, multiSteps } = this.props.uiStore;
    return (
      <div className={isMobile ? '' : 'center-align'}>
        <Header as="h3">
          What is your household
            {"'"}
          s annual income and net worth?
        </Header>
        <p className={`${isMobile ? 'mb-30' : ''} tertiary-text`}>
          SEC rules and regulations require broker-dealers to collect this information
          to determine investor suitability for private offerings.
        </p>
        {/* <p className="tertiary-text">
          Select whether you are providing your information as an individual or as a couple.
        </p> */}
        {!isMobile && <Divider hidden />}
        <Form error>
          <FormRadioGroup
            fielddata={FINANCES_FORM.fields.investorProfileType}
            name="investorProfileType"
            changed={(e, result) => {
              investorProfileChange(e, result);
              this.props.uiStore.scrollIntoActiveInputFields();
            }}
            containerclassname="three wide button-radio center-align"
            showerror
          />
          <Divider hidden />
          <div className={`${isMobile ? '' : 'field-wrap'} left-align`}>
            <Form.Group widths={2}>
              {['netWorth', 'annualIncomeCurrentYear'].map(field => (
                <MaskedInput
                  key={field}
                  name={field}
                  type="tel"
                  currency
                  fielddata={FINANCES_FORM.fields[field]}
                  changed={financesChange}
                  prefix="$ "
                  number
                  disableDecimal
                  maxlength={13}
                />
              ))}
            </Form.Group>
          </div>
          {errors
            && (
              <Message error className="mt-30">
                <ListErrors errors={errors.message ? [errors.message] : [errors]} />
              </Message>
            )
          }
        </Form>
        <p className="tertiary-text note mt-10 mb-30">
          We will never share your personal information with third parties without your consent
        </p>
        {isMobile
          && <Button primary size="large" onClick={() => updateInvestorProfileData(multiSteps && multiSteps[stepToBeRendered])} fluid={isMobile} className={`${isMobile ? 'mt-30' : 'mb-20'} relaxed`} disabled={!FINANCES_FORM.meta.isValid} content="Continue" />
        }
      </div>
    );
  }
}
