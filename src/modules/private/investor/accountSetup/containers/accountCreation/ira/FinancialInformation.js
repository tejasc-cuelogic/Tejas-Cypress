import React from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';

@inject('iraAccountStore')
@observer
export default class FinancialInformation extends React.Component {
  render() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Your financial information</Header>
        <Header as="h4" textAlign="center">Your net worth and annual income are used to determine your 12-month<br />investment limit. <Link className="link" to="/app/summary">How is this calculated?</Link></Header>
        <Form error>
          <div className="field-wrap">
            {
              ['netWorth', 'annualIncome'].map(field => (
                <FormInput
                  key={field}
                  type="text"
                  fielddata={FIN_INFO_FRM.fields[field]}
                  name={field}
                  changed={finInfoChange}
                  prefix="$"
                  maxLength={FIN_INFO_FRM.fields[field].maxLength}
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
