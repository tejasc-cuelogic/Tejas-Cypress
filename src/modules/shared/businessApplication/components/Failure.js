import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Grid, Icon, Header, Divider } from 'semantic-ui-react';
import Initialise from './lendio/Initialise';

@observer
export default class Failure extends Component {
  render() {
    const { match, isPublic } = this.props;
    const reason = match.params.reason ? match.params.reason : '';
    return (
      <Grid container>
        <Grid.Column className="issuer-signup">
          <Icon className="ns-paper-plane" size="massive" color="green" />
          <Header as="h1">Thank you for completing the pre-qualification form</Header>
          <p>
            <b>Unfortunately, NextSeed is currently unable to help your business at this time.</b>
          </p>
          <p>
            We`ll update you if anything changes in the future. In the meantime, if you have
            any questions, you can contact us at <a href="mailto:apply@nextseed.com" className="link"><b>apply@nextseed.com</b></a> or<br />
            check out our <Link to="business/how-it-works" className="link"><b>How it Works</b></Link> or <Link to="/resources/education-center/business" className="link"><b>Education Center </b></Link>
                 for more information on our general business requirements.
          </p>
          <Divider section hidden />
          {reason && reason === 'lendio'
            && <Initialise isPublic={isPublic} {...this.props} />
          }
        </Grid.Column>
      </Grid>
    );
  }
}
