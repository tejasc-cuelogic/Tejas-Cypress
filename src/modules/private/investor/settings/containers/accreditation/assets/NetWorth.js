import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('accreditationStore')
@withRouter
@observer
export default class NetWorth extends Component {
  componentWillMount() {
    const { accountType } = this.props.match.params;
    this.props.accreditationStore.setFormData('NET_WORTH_FORM', 'accreditation', accountType);
  }
  render() {
    const { NET_WORTH_FORM, netWorthChange } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What is your net worth?</Header>
        <p className="center-align">My net worth is at least</p>
        <Form error className="account-type-tab">
          <FormRadioGroup
            vertical
            // withtooltip
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
