import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormRadioGroup } from '../../../../../../../theme/form';
import { ENTITY_TRUST_NET_WORTH, NET_WORTH } from './../../../../../../../services/constants/investmentLimit';

@inject('accreditationStore')
@observer
export default class NetWorth extends Component {
  componentWillMount() {
    if (this.props.isTrust) {
      this.props.accreditationStore.changeFormObject('NET_WORTH_FORM', ENTITY_TRUST_NET_WORTH);
    } else {
      this.props.accreditationStore.changeFormObject('NET_WORTH_FORM', NET_WORTH);
    }
  }
  render() {
    const {
      NET_WORTH_FORM,
      netWorthChange,
    } = this.props.accreditationStore;
    return (
      <div>
        <Header as="h3" textAlign="center">What is your {this.props.isTrust ? 'trust' : ''} net worth?</Header>
        <p className="center-align">{this.props.isTrust ? 'The trust net worth is at least' : 'My net worth is at least'}</p>
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
