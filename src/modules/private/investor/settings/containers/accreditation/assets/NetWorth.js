import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('accreditationStore')
@observer
export default class NetWorth extends Component {
  render() {
    const { NET_WORTH_FORM, netWorthChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What is your net worth?</Header>
        <p className="center-align">My net worth is at least</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            // vertical
            withtooltip
            fielddata={NET_WORTH_FORM.fields.netWorth}
            name="netWorth"
            changed={netWorthChange}
            containerclassname="button-radio center-align"
          />
        </Form>
      </div>
    );
  }
}
