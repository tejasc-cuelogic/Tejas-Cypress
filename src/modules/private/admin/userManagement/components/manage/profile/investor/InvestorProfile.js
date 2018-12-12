import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Header, Icon, Form, Divider } from 'semantic-ui-react';
import { FormInput, MaskedInput } from '../../../../../../../../theme/form';

@inject('userDetailsStore')
@observer
export default class InvestorProfile extends Component {
  state = { displayMode: true };
  componentWillMount() {
    this.props.userDetailsStore.setFormData('USER_INVESTOR_PROFILE', 'investorProfileData');
  }
  render() {
    const { USER_INVESTOR_PROFILE, formChange } = this.props.userDetailsStore;
    const formName = 'USER_INVESTOR_PROFILE';
    const { displayMode } = this.state;
    return (
      <Form>
        <Header as="h4">
          Investor Profile
          <Link to={this.props.match.url} className="link pull-right"><small><Icon className="ns-pencil" /> Edit profile data</small></Link>
        </Header>
        <Header as="h6">Employment</Header>
        <Form.Group widths={3}>
          {
          ['status', 'employer', 'position'].map(field => (
            <FormInput
              key={field}
              name={field}
              fielddata={USER_INVESTOR_PROFILE.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              displayMode={displayMode}
            />
          ))
          }
        </Form.Group>
        <Divider />
        <Header as="h6">Finances</Header>
        <Form.Group widths={3}>
          {['netWorth', 'annualIncomeThirdLastYear', 'annualIncomeLastYear', 'annualIncomeCurrentYear'].map(field => (
            <MaskedInput
              type="tel"
              key={field}
              name={field}
              currency
              fielddata={USER_INVESTOR_PROFILE.fields[field]}
              changed={(e, result) => formChange(e, result, formName)}
              prefix="$ "
              displayMode={displayMode}
            />
          ))
          }
        </Form.Group>
        <FormInput
          key="investorProfileType"
          name="investorProfileType"
          fielddata={USER_INVESTOR_PROFILE.fields.investorProfileType}
          changed={(e, result) => formChange(e, result, formName)}
          displayMode={displayMode}
        />
        <Divider />
        <Header as="h6">Experience</Header>
        <Form.Group widths={3}>
          <FormInput
            key="experienceLevel"
            name="experienceLevel"
            fielddata={USER_INVESTOR_PROFILE.fields.experienceLevel}
            changed={(e, result) => formChange(e, result, formName)}
            displayMode={displayMode}
          />
        </Form.Group>
      </Form>
    );
  }
}
