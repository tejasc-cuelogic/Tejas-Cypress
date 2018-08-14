import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Form, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../../../theme/form';

@inject('businessAppStore', 'uiStore')
@observer
export default class BusinessDetails extends Component {
  render() {
    const {
      BUSINESS_APP_FRM, businessAppEleChange, preQualFormDisabled,
    } = this.props.businessAppStore;
    const { fields } = BUSINESS_APP_FRM;
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">What is your Business Model?</Header>
          <p>Business to Consumer</p>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">General Information</Header>
          <Form.Group widths={4}>
            {
              ['street', 'city', 'state', 'zipCode'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
          <Form.Group widths={4}>
            {
              ['website', 'phoneNumber'].map(field => (
                <FormInput
                  disabled={preQualFormDisabled}
                  key={field}
                  type="text"
                  name={field}
                  value="Value"
                  fielddata={fields[field]}
                  changed={businessAppEleChange}
                  containerclassname="display-only"
                  readOnly
                />
              ))
            }
          </Form.Group>
        </div>
        <div className="inner-content-spacer">
          <Header as="h4">Business Plan</Header>
          <Link to="/"><Icon className="ns-file" /><b>nsbakery_businessplan050518.pdf</b></Link>
        </div>
      </Form>
    );
  }
}
