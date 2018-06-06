import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('newBusinessStore', 'uiStore')
@observer
class Success extends Component {
  render() {
    // const {
    //   BUSINESS_ACCOUNT, businessAccEleChange,
    // } = this.props.newBusinessStore;
    // const { fields } = BUSINESS_ACCOUNT;
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
        <Button as={Link} to="/auth/login" size="large" color="green" className="very relaxed">Proceed</Button>
      </Grid.Column>
    );
  }
}

export default Success;
