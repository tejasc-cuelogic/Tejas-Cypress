import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment, Grid } from 'semantic-ui-react';
import PreQualification from '../../../private/issuer/businessApplication/components/PreQualification';
import Success from '../components/Success';
import Failure from '../components/Failure';
import Application from '../components/lendio/Application';

class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content">
        <Grid container>
          <Switch>
            <Route exact path="/business-application" component={PreQualification} />
            <Route path="/business-application/lendio" component={Application} />
            <Route path="/business-application/success" component={Success} />
            <Route path="/business-application/failed/:reason?" component={Failure} />
          </Switch>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
