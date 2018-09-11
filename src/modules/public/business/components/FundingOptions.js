import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Header, Container, Menu, Segment, Button, Grid, Responsive } from 'semantic-ui-react';
import { InlineLoader, MobileDropDownNav } from '../../../../theme/shared';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../helper';

const getModule = component => Loadable({
  loader: () => import(`./fundingOptions/${component}`),
  loading() {
    return <InlineLoader />;
  },
});

const navItems = [
  { title: 'Term Notes', to: 'term-notes' },
  { title: 'Revenue Sharing', to: 'revenue-sharing' },
  { title: 'Equity Loans', to: 'equity-loans' },
];
const isMobile = document.documentElement.clientWidth < 768;

export default class FundingOption extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.replace(`${this.props.match.url}/term-notes`);
    }
  }
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match, location } = this.props;
    return (
      <Aux>
        <Container>
          <section className="funding-option account-type-tab">
            <Grid centered>
              <Grid.Column computer={13} tablet={16} mobile={16} textAlign={isMobile ? 'left' : 'center'}>
                <Header as="h2">
                Choose a funding option that fits your business.
                </Header>
                <p className={isMobile ? 'mb-10' : 'mb-50'}>
                Whether you need working capital for your existing business,
                expansion projects or a new venture, our financial products
                put you in control. Grow your business on your own terms.
                </p>
              </Grid.Column>
            </Grid>
            <Responsive minWidth={768} as={Menu} tabular fluid widths={3}>
              <NavItems sub refLoc="public" location={location} navItems={navItems} />
            </Responsive>
            <MobileDropDownNav refMatch={match} navItems={navItems} location={location} />
            <Segment attached="bottom" padded>
              <Switch>
                <Route
                  exact
                  path={match.url}
                  component={getModule(this.module(navItems[0].title))}
                />
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
            </Segment>
            <div className="center-align">
              <Button secondary>Apply Now</Button>
              <Button as={Link} to="/business/process" primary>See Process</Button>
            </div>
          </section>
        </Container>
      </Aux>
    );
  }
}
