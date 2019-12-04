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
  constructor(props) {
    super(props);
    if (props.match.isExact) {
      props.history.replace(`${props.match.url}/mission`);
    }
  }

  module = name => DataFormatter.upperCamelCase(name);

  handleUpdate = (e, { calculations }) => this.props.navStore.setNavStatus(calculations);

  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <>
        {/* {location.pathname === '/about/mission' && <Banner />} */}
        <Visibility onUpdate={this.handleUpdate} continuous className="slide-down">
          {/* <PublicSubNav
            stepInRoute={navStore.stepInRoute}
            location={location}
            currentUser={this.props.userStore.currentUser}
            navItems={navItems}
            title="About Us"
          /> */}
            <SuspenseBoundary>
              <Switch>
                <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
                {
                  navItems.map(item => (
                    <Route
                      key={item.to}
                      path={`${match.url}/${item.to}`}
                      component={getModule(this.module(item.title))}
                    />
                  ))
                }
              </Switch>
            </SuspenseBoundary>
        </Visibility>
      </>
    );
  }
}

export default About;
