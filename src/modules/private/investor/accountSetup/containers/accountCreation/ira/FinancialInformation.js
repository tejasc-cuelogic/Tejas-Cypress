import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput } from '../../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class FinancialInformation extends React.Component {
  render() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Calculating your investment limit</Header>
        <p className="center-align">Your net worth and annual income are used to determine your 12-month investment limit. <Link className="link" to="/app/summary/account-creation/ira">How is this calculated?</Link></p>
        <Form error>
          <div className="field-wrap">
            {
              ['netWorth', 'annualIncome'].map(field => (
                <MaskedInput
                  key={field}
                  type="tel"
                  fielddata={FIN_INFO_FRM.fields[field]}
                  name={field}
                  changed={values => finInfoChange(values, field)}
                  prefix="$ "
                  maxLength={FIN_INFO_FRM.fields[field].maxLength}
                  currency
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
