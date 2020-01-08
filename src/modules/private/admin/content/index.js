import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { SuspenseBoundary, lazyRetry } from '../../../../theme/shared';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';

const getModule = component => lazyRetry(() => import(`../${component}`));

export default class Content extends Component {
  constructor(props) {
    super(props);
    const { match } = this.props;
    if (match.isExact) {
      this.props.history.push(`${match.url}/categories`);
    }
  }

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], false).subNavigations;
    return (
      <SuspenseBoundary>
        <Switch>
          {
            navItems.map((item) => {
              const CurrentComponent = getModule(item.component);
              return (
                <Route key={item.to} path={`${match.url}/${item.to}`} render={props => (<CurrentComponent refMatch={match} {...props} />)} />
              );
            })
          }
        </Switch>
      </SuspenseBoundary>
    );
  }
}
