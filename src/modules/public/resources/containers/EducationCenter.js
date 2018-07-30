import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Switch } from 'react-router-dom';
import Banner from '../components/Banner';
import Summary from '../components/Summary';
import EducationCentreDetails from '../components/EducationCentreDetails';

export default class EducationCenter extends Component {
  render() {
    const { match } = this.props;
    return (
      <Aux>
        <Banner title="Education Center" />
        <Switch>
          <Route exact path={match.url} render={() => <Summary refUrl={match.url} />} />
          <Route path={`${match.url}/:for`} component={EducationCentreDetails} />
        </Switch>
      </Aux>
    );
  }
}
