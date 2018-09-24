import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import PreQualification from '../../../shared/businessApplication/components/PreQualification';
import Success from '../../../shared/businessApplication/components/Success';
import Failure from '../../../shared/businessApplication/components/Failure';
import Application from '../../../shared/businessApplication/components/lendio/Application';
import LendioSuccess from '../../../shared/businessApplication/components/lendio/LendioSuccess';
import NeedHelpModal from '../../../shared/businessApplication/components/NeedHelpModal';

class Signup extends Component {
  render() {
    return (
      <Segment vertical className="content">
        <Switch>
          <Route exact path="/business-application/questions/need-help" render={props => <NeedHelpModal isPublic {...props} />} />
          <Route exact path="/business-application/:applicationType" render={props => <PreQualification isPublic {...props} />} />
          <Route exact path="/business-application/:applicationType/:id/lendio" render={props => <Application isPublic {...props} />} />
          <Route exact path="/business-application/:applicationType/:id/lendio/:condition" render={props => <LendioSuccess isPublic {...props} />} />
          <Route exact path="/business-application/:applicationType/:id/success" render={props => <Success isPublic {...props} />} />
          <Route exact path="/business-application/:applicationType/:id/failed/:reason?" render={props => <Failure isPublic {...props} />} />
        </Switch>
      </Segment>
    );
  }
}

export default Signup;
