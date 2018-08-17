import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button, Form } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { FormInput } from '../../../../theme/form';

@inject('authStore', 'uiStore')
@observer
class Success extends Component {
  render() {
    const { signupChange } = this.props.authStore;
    const { fields } = this.props.authStore.SIGNUP_FRM;
    return (
      <Grid.Column className="issuer-signup">
        <Icon className="ns-paper-plane" size="massive" color="green" />
        <Header as="h1">Congratulations!</Header>
        <p>
          <b>You have been pre-qualified for a NextSeed campaign.</b>
        </p>
        <p>
        In the meantime, please begin filling out the rest of the application and submitting the
        necessary paperwork. Our step-by-step guide will walk you through the steps and keep
        the process organized.
        </p>
        <Form>
          <Grid>
            <Grid.Column widescreen={7} largeScreen={7} computer={8} tablet={16} mobile={16}>
              {
                ['password', 'verify'].map(field => (
                  <FormInput
                    key={field}
                    type="password"
                    name={field}
                    fielddata={fields[field]}
                    changed={signupChange}
                  />
                ))
              }
            </Grid.Column>
          </Grid>
        </Form>
        <Divider section hidden />
        <Button as={Link} to="/auth/login" size="large" color="green" className="very relaxed">Proceed</Button>
      </Grid.Column>
    );
  }
}

export default Success;
