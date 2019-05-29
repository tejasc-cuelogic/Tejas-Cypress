import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import EducationCenter from './containers/EducationCenter';
import Insights from './containers/Insights';
import InsightsDetails from './containers/InsightsDetails';
import CaseStudies from './containers/CaseStudies';
import Community from './containers/Community';

export default class Resources extends Component {
  render() {
    const { match } = this.props;
    return (
      <Switch>
        <Route path={`${match.url}/education-center`} component={EducationCenter} />
        <Route key="insights" exact path={`${match.url}/insights`} component={Insights} />
        <Route key="category" exact path={`${match.url}/insights/category/:id`} component={Insights} />
        <Route exact path={`${match.url}/insights/:slug`} component={InsightsDetails} />
        <Route exact path={`${match.url}/case-studies`} component={CaseStudies} />
        <Route exact path={`${match.url}/community`} component={Community} />
      </Switch>
    );
  }
}
