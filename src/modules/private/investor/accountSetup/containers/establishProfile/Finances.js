import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form, Message, Divider } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { ListErrors } from '../../../../../../theme/shared';
import formHOC from '../../../../../../theme/form/formHOC';

const metaInfo = {
  store: 'investorProfileStore',
  form: 'FINANCIAL_INFO_FRM',
};

@inject('investorProfileStore', 'uiStore')
@withRouter
@observer
class Finances extends Component {
  render() {
    const { errors } = this.props.uiStore;
    const { smartElement } = this.props;
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
          {
            smartElement.RadioGroup('taxFilingAs', {
              containerclassname: 'three wide button-radio center-align',
            })
          }

          <Divider hidden />
          <div className="field-wrap left-align">
            <Form.Group widths={2}>
              {['netWorth', 'annualIncomeCurrentYear'].map(field => (
                smartElement.Masked(field, { currency: true, prefix: '$ ', disableDecimal: true, maxlength: 13 })
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
      </div>
    );
  }
}
export default formHOC(Finances, metaInfo);
