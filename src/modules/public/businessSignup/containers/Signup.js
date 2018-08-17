import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment, Grid } from 'semantic-ui-react';
import PreQualification from '../../../private/issuer/businessApplication/components/PreQualification';
import Success from '../../../private/issuer/businessApplication/components/Success';
import Failure from '../../../private/issuer/businessApplication/components/Failure';
import Application from '../../../private/issuer/businessApplication/components/lendio/Application';
import LendioSuccess from '../../../private/issuer/businessApplication/components/lendio/LendioSuccess';

class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content">
        <Grid container>
          <Switch>
            <Route exact path="/business-application" render={props => <PreQualification isPublic {...props} />} />
            <Route path="/business-application/:id/lendio/:condition" render={props => <LendioSuccess isPublic {...props} />} />
            <Route path="/business-application/:id/lendio" render={props => <Application isPublic {...props} />} />
            <Route path="/business-application/:id/success" render={props => <Success isPublic {...props} />} />
            <Route path="/business-application/:id/failed/:reason?" render={props => <Failure isPublic {...props} />} />
          </Switch>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
