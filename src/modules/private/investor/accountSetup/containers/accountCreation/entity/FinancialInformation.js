import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Form } from 'semantic-ui-react';
import { MaskedInput2 } from '../../../../../../../theme/form';

@inject('entityAccountStore')
@observer
export default class FinancialInformation extends Component {
  render() {
    const { FIN_INFO_FRM, maskedFinInfoChange } = this.props.entityAccountStore;
    return (
      <div>
        <Header as="h3" textAlign="center">Calculating your Entity{"'"}s investment limit</Header>
        <p className="center-align">
          Your entity{"'"}s net assets and annual income are used to determine its 12-month investment limit. <Link to="/app/summary/account-creation/entity" className="link">How is this calculated?</Link>
        </p>
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
                  changed={values => maskedFinInfoChange(values, field)}
                  currency
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
