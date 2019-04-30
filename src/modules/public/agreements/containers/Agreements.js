import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Container } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import Loadable from 'react-loadable';
import { Route, Switch, withRouter } from 'react-router-dom';
import SecondaryMenu from '../../../../theme/layout/SecondaryMenu';
import { GetNavMeta } from '../../../../theme/layout/SidebarNav';
import { InlineLoader } from '../../../../theme/shared';
import { DataFormatter } from '../../../../helper';
import NotFound from '../../../shared/NotFound';

const getModule = component => Loadable({
  loader: () => import(`../components/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const isMobile = document.documentElement.clientWidth < 768;
@inject('navStore')
@withRouter
@observer
export default class TermsOfUse extends Component {
  componentWillMount() {
    this.props.navStore.setFieldValue('subNavStatus', 'animate reverse');
    this.props.navStore.setFieldValue('navStatus', 'main');
    if (this.props.match.isExact) {
      const navItems = GetNavMeta(this.props.match.url, [], true).subNavigations;
      if (navItems[0]) {
        this.props.history.push(`${this.props.match.url}/${navItems[0].to}`);
      }
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    const navItems = GetNavMeta(match.url, [], true).subNavigations;
    return (
      <Aux>
        {isMobile &&
        <SecondaryMenu secondary vertical match={match} navItems={navItems} />
        }
        <section>
          <Container>
            <Grid className="legal-section">
              {!isMobile &&
                <Grid.Column widescreen={3} computer={3} tablet={4} mobile={16}>
                  <div className="sticky-sidebar legal-sidebar">
                    <SecondaryMenu
                      secondary
                      vertical
                      match={match}
                      navItems={navItems}
                      className="legal-menu"
                    />
                  </div>
                </Grid.Column>
              }
              <Grid.Column widescreen={13} computer={13} tablet={12} mobile={16}>
                <Switch>
                  {navItems[0] && (
                    <Route
                      exact
                      path={match.url}
                      component={getModule(this.module(navItems[0].title))}
                    />
                  )}
                  {
                  navItems.map(item => (
                    <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                  ))
                  }
                  <Route component={NotFound} />
                </Switch>
              </Grid.Column>
            </Grid>
          </Container>
        </section>
      </Aux>
    );
  }
}
