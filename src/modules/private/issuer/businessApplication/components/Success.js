import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

@inject('businessAppStore', 'uiStore')
@observer
class Success extends Component {
  render() {
    return (
      <Grid container>
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
          <Divider section hidden />
          <Button as={Link} to={`${this.props.refLink}/business-details`} size="large" color="green" className="very relaxed">Proceed</Button>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Success;
