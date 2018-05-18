import React from 'react';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../theme/form/FormElements';

@inject('iraAccountStore')
@observer
export default class FinancialInformation extends React.Component {
  render() {
    const { formFinInfo, finInfoChange } = this.props.iraAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Complete your financial information</Header>
        <Header as="h4" textAlign="center">Lorem psum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Header>
        <Form error>
          <div className="field-wrap">
            {
              ['networth', 'annualIncome'].map(field => (
                <FormInput
                  key={field}
                  type="text"
                  fielddata={formFinInfo.fields[field]}
                  name={field}
                  changed={finInfoChange}
                  prefix="$"
                  maxLength={formFinInfo.fields[field].maxLength}
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
