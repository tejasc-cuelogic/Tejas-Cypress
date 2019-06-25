import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button, Responsive } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessAppStore', 'uiStore')
@observer
class Success extends Component {
  render() {
    return (
      <Grid.Column className="issuer-signup">
        <Icon className="ns-paper-plane" size="massive" color="green" />
        <Header as="h1">Congratulations!</Header>
        <p>
          <b>You have been pre-qualified for a NextSeed campaign.</b>
        </p>
        <p>
          Thanks for submitting Tstbsn`s application, Jane Doee! A NextSeed representative
          will be reaching out to you shortly.<Responsive minWidth={768} as="br" />
          In the meantime, please set up a user account to continue with your application.
        </p>
        <Divider section hidden />
        <Button as={Link} to="/login" size="large" color="green" className="very relaxed">Proceed</Button>
      </Grid.Column>
    );
  }
}

export default Success;
