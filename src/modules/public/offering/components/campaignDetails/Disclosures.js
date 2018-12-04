import React, { Component } from 'react';
import Aux from 'react-aux';
import { Grid } from 'semantic-ui-react';
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
  { title: 'Disclosure', to: 'disclosure', content: 'offeringpageignited.pdf' },
  { title: 'Purchase Agreement', to: 'purchase-agreement', content: 'offeringpageignited.pdf' },
  { title: 'Current Capitalization Table', to: 'current-capitalization-table', content: 'offeringpageignited.pdf' },
  { title: 'Escrow Agreement', to: 'escrow-agreement', content: 'offeringpageignited.pdf' },
  { title: 'Operating Agreement', to: 'operating-agreement', content: 'offeringpageignited.pdf' },
];
@withRouter
export default class TermsOfUse extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      // const navItems = GetNavMeta(this.props.match.url, [], true).subNavigations;
      this.props.history.push(`${this.props.match.url}/disclosure`);
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
                  render={
                    props =>
                      (<Disclosure
                        {...props}
                        documentToLoad={navItems[0].content}
                        headerTitle={navItems[0].title}
                      />)
                  }
                />
                {
                  navItems.map(item => (
                    <Route
                      exact={false}
                      key={item.to}
                      documentToLoad={item.content}
                      path={`${match.url}/${item.to}`}
                      render={
                        props =>
                          (<Disclosure
                            {...props}
                            documentToLoad={item.content}
                            headerTitle={item.title}
                          />)
                      }
                    />
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
