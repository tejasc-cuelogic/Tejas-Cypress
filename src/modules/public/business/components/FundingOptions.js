import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import Loadable from 'react-loadable';
import { Header, Container, Menu, Segment, Button, Grid } from 'semantic-ui-react';
import Aux from 'react-aux';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../helper';

const getModule = component => Loadable({
  loader: () => import(`./fundingOptions/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});

const navItems = [
  { title: 'Term Notes', to: 'term-notes' },
  { title: 'Revenue Sharing', to: 'revenue-sharing' },
  { title: 'Equity Loans', to: 'equity-loans' },
];

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
              <Grid.Column width={13}>
                <Header as="h2" textAlign="center">
                Choose a funding option that fits your business.
                </Header>
                <p className="center-align mb-50">
                Whether you need working capital for your existing business,
                expansion projects or a new venture, our financial products
                put you in control. Grow your business on your own terms.
                </p>
              </Grid.Column>
            </Grid>
            <Menu tabular fluid widths={3}>
              <NavItems sub refLoc="public" location={location} navItems={navItems} />
            </Menu>
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
