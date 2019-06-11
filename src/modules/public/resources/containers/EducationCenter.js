import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Switch } from 'react-router-dom';
import Banner from '../components/Banner';
import Summary from '../components/Summary';
import EducationCenterDetails from '../components/EducationCenterDetails';

export default class EducationCenter extends Component {
  find = (location) => {
    if (location.pathname.includes('investor')) {
      return 'investor';
    } if (location.pathname.includes('business')) {
      return 'business';
    }
    return null;
  }

  render() {
    const { match, location } = this.props;
    return (
      <Aux>
        <Banner
          title="Education Center"
          subtitle={this.find(location) === 'investor' ? 'For Investors' : this.find(location) === 'business' ? 'For Business' : null}
          type={this.find(location)}
        />
        <Switch>
          <Route exact path={match.url} render={() => <Summary refUrl={match.url} />} />
          <Route path={`${match.url}/:for`} component={EducationCenterDetails} />
        </Switch>
      </Aux>
    );
  }
}
