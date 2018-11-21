import React, { Component } from 'react';
import { Header, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { FormRadioGroup } from '../../../../../../../theme/form';

@inject('accreditationStore')
@withRouter
@observer
export default class NetWorth extends Component {
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
