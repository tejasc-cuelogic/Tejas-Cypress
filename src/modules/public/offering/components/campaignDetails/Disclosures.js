import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid, Container } from 'semantic-ui-react';
import { Route, Switch, withRouter } from 'react-router-dom';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
// import { InlineLoader } from '../../../../../theme/shared';
import { DataFormatter } from '../../../../../helper';
import Disclosure from './DataRoom/Disclosure';

// const getModule = component => Loadable({
//   loader: () => import(`./DataRoom/${component}`),
//   loading() {
//     return <InlineLoader />;
//   },
// });

const isMobile = document.documentElement.clientWidth < 768;

const navItems = [
  { title: 'Disclosure', to: 'disclosure' },
  { title: 'Purchase Agreement', to: 'purchase-agreement' },
  { title: 'Current Capitalization Table', to: 'current-capitalization-table' },
  { title: 'Escrow Agreement', to: 'escrow-agreement' },
  { title: 'Operating Agreement', to: 'operating-agreement' },
];
@withRouter
export default class TermsOfUse extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      // const navItems = GetNavMeta(this.props.match.url, [], true).subNavigations;
      this.props.history.push(`${this.props.match.url}/disclosures`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    return (
      <Aux>
        {isMobile &&
          <SecondaryMenu
            secondary
            vertical
            match={match}
            navItems={navItems}
          />
        }
        <div className="campaign-content-wrapper">
          <Grid>
            {!isMobile &&
              <Grid.Column widescreen={3} computer={3} tablet={4} mobile={16}>
                <div className="sticy-sidebar legal-sidebar">
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
                <Route
                  exact
                  path={`${match.url}/${navItems[0].to}`}
                  // component={Disclosures}
                  render={props => <Disclosure {...props} />}
                />
                {
                  navItems.map(item => (
                    <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} render={props => <Disclosure {...props} />} />
                  ))
                }
              </Switch>
            </Grid.Column>
          </Grid>
        </div>
      </Aux>
    );
  }
}
