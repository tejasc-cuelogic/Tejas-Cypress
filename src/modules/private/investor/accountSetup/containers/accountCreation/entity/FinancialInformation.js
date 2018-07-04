import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { FormInput } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  render() {
    const { formFinInfo, finInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h1" textAlign="center">Calculating your Entity`s <br /> investment limit</Header>
        <Header as="h4" textAlign="center">
        Your entity`s net assets and annual income are used to determine its <br />
        12-month investment limit. <Link to="/app/summary" className="link">How is this calculated?</Link>
        </Header>
        <Form error>
          <div className="field-wrap">
            {
              ['netAssets', 'cfInvestment'].map(field => (
                <FormInput
                  key={field}
                  name={field}
                  fielddata={formFinInfo.fields[field]}
                  maxLength={formFinInfo.fields[field].maxLength}
                  changed={finInfoChange}
                  prefix="$"
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
