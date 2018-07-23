import React, { Component } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Icon, Header, List, Form, Grid, Divider, Button } from 'semantic-ui-react';
import { FormInput, FormDropDown, FormCheckbox, MaskedInput2 } from '../../../../../../theme/form';
import FormElementWrap from '../FormElementWrap';
import { LENDING_PARTNER_LENDIO } from '../../../../../../constants/business';
import { LENDIO } from '../../../../../../services/constants/newBusiness';
import Helper from '../../../../../../helper/utility';

@inject('businessAppStore', 'uiStore')
@observer
export default class Application extends Component {
  submit = (e) => {
    e.preventDefault();
    this.props.businessAppStore.businessLendioPreQual()
      .then((data) => {
        const {
          submitPartneredWithLendio: {
            status,
            url,
          },
        } = data;
        const redirectParam = (status === LENDIO.LENDIO_SUCCESS) ? 'yes' : 'no';

        this.props.history.push(`/app/business-application/${this.props.businessAppStore.currentApplicationId}/lendio/${redirectParam}`);
        this.props.businessAppStore.setLendioUrl(url);
      })
      .catch(() => {
        Helper.toast('Something went wrong, please try again later.', 'error');
      });
  };

  render() {
    const {
      LENDIO_QUAL_FRM,
      lendioEleChange,
    } = this.props.businessAppStore;
    const { fields } = LENDIO_QUAL_FRM;
    const checkIsPresent = _.indexOf(fields.applicationAgreeConditions.value, 'agreeConditions');
    return (
      <Grid container>
        <Grid.Column className="issuer-signup">
          <Header as="h1">NextSeed has Partnered with Lendio</Header>
          <p>
            Lendio is a leading small business loan marketplace where
            completing one free application will put you in front of 75+ lenders.<br />
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
          <Form>
            <FormElementWrap>
              <Grid>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <Header as="h2">Pre-Qualification Questions</Header>
                  <div className="field-wrap">
                    {
                      ['yrsInBusiness', 'avgSales', 'personalCreditRating', 'industry', 'raiseAmount'].map(field => (
                        <FormDropDown
                          fielddata={fields[field]}
                          search
                          selection
                          placeholder="Please Select"
                          containerclassname="dropdown-field"
                          value={fields[field].value}
                          name={field}
                          options={LENDING_PARTNER_LENDIO[field]}
                          onChange={(e, res) => lendioEleChange(e, res, 'dropdown')}
                        />
                      ))
                    }
                  </div>
                </Grid.Column>
                <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
                  <Header as="h2">Customer Information</Header>
                  <div className="field-wrap">
                    {
                      ['businessName', 'businessOwnerName', 'emailAddress'].map(field => (
                        <FormInput
                          key={field}
                          type="text"
                          name={field}
                          fielddata={fields[field]}
                          changed={lendioEleChange}
                        />
                      ))
                    }
                    <MaskedInput2
                      name="phoneNumber"
                      fielddata={fields.phoneNumber}
                      changed={lendioEleChange}
                    />
                    <FormInput
                      key="comments"
                      type="text"
                      name="comments"
                      fielddata={fields.comments}
                      changed={lendioEleChange}
                    />
                  </div>
                </Grid.Column>
              </Grid>
            </FormElementWrap>
            <Header as="h2">Submit your application to Lendio</Header>
            <p>
              Do you give Lendio and their <Link to="/" className="link"><b>partners</b></Link> permission to
              contact you at the number and email you provided, including via email, phone, text
              message and cell phone, including the use of automated dialing equipment or
              pre-recorded calls and messages? Your consent is not a condition of
              receiving services from Lendio. If you decline to move forward, none of
              your information will be sent to Lendio.
              <br /><br />
              <small>
                <b>As an official partner, NextSeed may be compensated through Lendio</b>
              </small>
            </p>
            <FormCheckbox
              fielddata={fields.applicationAgreeConditions}
              name="applicationAgreeConditions"
              changed={(e, res) => lendioEleChange(e, res, 'checkbox')}
              defaults
              containerclassname="ui relaxed list"
            />
            <Divider hidden />
            <Button
              loading={this.props.uiStore.inProgress}
              disabled={!LENDIO_QUAL_FRM.meta.isValid || checkIsPresent === -1}
              onClick={this.submit}
              primary
              className="very relaxed"
            >
              Submit
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}
