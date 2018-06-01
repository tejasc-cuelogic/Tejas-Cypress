import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment, Grid } from 'semantic-ui-react';
import PreQualification from '../../../private/businessApplication/components/PreQualification';
import Success from '../components/Success';
import Failure from '../components/Failure';

class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content">
        <Grid container>
          <Switch>
            <Route exact path="/business-application" component={PreQualification} />
            <Route exact path="/business-application/success" component={Success} />
            <Route exact path="/business-application/failed" component={Failure} />
          </Switch>
        </Grid>
      </Segment>
    );
  }
}

export default Signup;
