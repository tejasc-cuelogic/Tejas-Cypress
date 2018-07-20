import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput2 } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  render() {
    const { FIN_INFO_FRM, finInfoChange } = this.props.entityAccountStore;
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
                <MaskedInput2
                  key={field}
                  name={field}
                  placeHolder={field === 'netAssets' ? '$ 1,000,000' : '$ 5,000'}
                  fielddata={FIN_INFO_FRM.fields[field]}
                  maxLength={FIN_INFO_FRM.fields[field].maxLength}
                  changed={values => finInfoChange(values, field)}
                  currency
                  prefix="$ "
                />
              ))
            }
          </div>
        </Form>
      </div>
    );
  }
}
