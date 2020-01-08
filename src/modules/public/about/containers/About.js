import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Visibility } from 'semantic-ui-react';
import { DataFormatter } from '../../../../helper';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { SuspenseBoundary, lazyRetry } from '../../../../theme/shared';

const getModule = component => lazyRetry(() => import(`../components/${component}`));

@inject('navStore', 'userStore')
@observer
class About extends Component {
  module = name => DataFormatter.upperCamelCase(name);

  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <>
        <Visibility onUpdate={this.handleUpdate} continuous className="slide-down">
            <SuspenseBoundary>
              <Switch>
                <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
              </Switch>
            </SuspenseBoundary>
        </Visibility>
      </>
    );
  }
}

export default About;
