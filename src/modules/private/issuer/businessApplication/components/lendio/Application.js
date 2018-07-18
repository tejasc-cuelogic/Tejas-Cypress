import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Icon, Header, List, Form, Grid, Divider, Button, Checkbox } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { FormInput, FormDropDown } from '../../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';

@inject('newBusinessStore')
@observer
export default class Application extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.newBusinessStore.businessLendioPreQual();
    Helper.toast('Business pre-qualification request submitted!', 'success');
    this.props.history.push('/business-application/success/lendio');
  }
  render() {
    const {
      LENDIO_QUAL_FRM, lendioEleChange,
    } = this.props.newBusinessStore;
    const { fields } = LENDIO_QUAL_FRM;
    return (
      <Grid.Column className="issuer-signup">
        <Header as="h1">NextSeed has Partnered with Lendio</Header>
        <p>
          Lendio is a leading small business loan marketplace where completing one free application
          will put you in front of 75+ lenders.<br />
          The loan matching service is free with no obligation
        </p>
        <List horizontal className="feature-list">
          <List.Item>
            <Icon className="ns-timer" size="huge" />
            Quick
          </List.Item>
          <List.Item>
            <Icon className="ns-clipboard-check" size="huge" />
            Easy
          </List.Item>
          <List.Item>
            <Icon className="ns-shield-check" size="huge" />
            Secure
          </List.Item>
        </List>
        <Divider section />
        <Form onSubmit={this.submit}>
          <FormElementWrap>
            <Grid>
              <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                <Header as="h2">Pre-Qualification Questions</Header>
                <div className="field-wrap">
                  {
                    ['yrsInBusiness', 'avgSales', 'personalCreditRating', 'industryType', 'money'].map(field => (
                      <FormDropDown
                        fielddata={fields[field]}
                        search
                        selection
                        placeholder="Please Select"
                        containerclassname="dropdown-field"
                        name={field}
                        options={[
                          { key: '10', value: '10', text: '10' },
                          { key: '2000', value: '2000', text: '2000' },
                        ]}
                        changed={lendioEleChange}
                      />
                    ))
                  }
                </div>
              </Grid.Column>
              <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                <Header as="h2">Customer Information</Header>
                <div className="field-wrap">
                  {
                    ['businessName', 'businessOwnerName', 'emailAddress', 'phoneNumber', 'comments'].map(field => (
                      <FormInput
                        key={field}
                        type="text"
                        name={field}
                        fielddata={fields[field]}
                        changed={lendioEleChange}
                      />
                    ))
                  }
                </div>
              </Grid.Column>
            </Grid>
          </FormElementWrap>
          <Header as="h2">Submit your application to Lendio</Header>
          <p>
            Do you give Lendio and their <Link to="/" className="link"><b>partners</b></Link> permission to
            contact you at the number and email you provided, including via email, phone, text
            message and cell phone, including the use of automated dialing equipment or pre-recorded
            calls and messages? Your consent is not a condition of receiving services from Lendio.
            If you decline to move forward, none of your information will be sent to Lendio.
            <br /><br />
            <small><b>As an official partner, NextSeed may be compensated through Lendio</b></small>
          </p>
          <Checkbox label="I agree to the conditions above." /><br />
          <Checkbox label="I agree to send data to Lendio, our partner" />
          <Divider hidden />
          <Button primary className="very relaxed">Submit</Button>
        </Form>
      </Grid.Column>
    );
  }
}
