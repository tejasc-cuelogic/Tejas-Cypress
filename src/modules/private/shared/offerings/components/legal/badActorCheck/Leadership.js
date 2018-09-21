import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import SecondaryMenu from '../../../../../../../theme/layout/SecondaryMenu';
import Leader from './Leader';

@inject('offeringCreationStore')
@observer
export default class Leadership extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/leader/1`);
    }
  }
  render() {
    const { LEADER_FRM } = this.props.offeringCreationStore;
    const navItems = [];
    LEADER_FRM.fields.data.map((leader, index) => {
      navItems.push({ title: `Leader ${index + 1}`, to: `leader/${index + 1}` });
      return navItems;
    });
    const { match } = this.props;
    return (
      <div>
        <SecondaryMenu className="tertiary" match={match} navItems={navItems} />
        <Switch>
          <Route
            exact
            path={match.url}
            render={props =>
              <Leader refLink={match.url} {...props} index={0} />}
          />
          {
            navItems.map((item, index) => (
              <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Leader refLink={match.url} {...props} index={index || 0} />} />
            ))
          }
        </Switch>
      </div>
    );
  }
}
