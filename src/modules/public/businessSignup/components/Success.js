import React, { Component } from 'react';
import { Form, Grid, Icon, Header, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../theme/form/FormElements';

@inject('newBusinessStore', 'uiStore')
@observer
class Success extends Component {
  render() {
    const {
      BUSINESS_ACCOUNT, businessAccEleChange,
    } = this.props.newBusinessStore;
    const { fields } = BUSINESS_ACCOUNT;
    return (
      <Grid.Column className="issuer-signup">
        <Icon className="ns-paper-plane" size="huge" color="green" />
        <Header as="h1">Congratulations!</Header>
        <p>
          <b>You have been pre-qualified for a NextSeed campaign.</b>
        </p>
        <p>
          Thanks for submitting Tstbsn`s application, Jane Doee! A NextSeed representative
          will be reaching out to you shortly.<br />
          In the meantime, please set up a user account to continue with your application.
        </p>
        <Divider section hidden />
        <Form>
          <Grid>
            <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
              <div className="field-wrap">
                <FormInput
                  name="emailAddress"
                  value={fields.emailAddress.value}
                  fielddata={fields.emailAddress}
                  changed={businessAccEleChange}
                />
                <FormInput
                  type="password"
                  name="password"
                  value={fields.password.value}
                  fielddata={fields.password}
                  changed={businessAccEleChange}
                />
              </div>
              <Divider hidden />
              <Button
                loading={this.props.uiStore.inProgress}
                disabled={!BUSINESS_ACCOUNT.meta.isValid}
                size="large"
                color="green"
                className="very relaxed"
              >
                Continue
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
      </Grid.Column>
    );
  }
}

export default Success;
