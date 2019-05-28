import React, { Component } from 'react';
import Aux from 'react-aux';
import { Route, Switch, Link } from 'react-router-dom';
import { Header, Container, Menu, Segment, Grid, Responsive, Divider, List } from 'semantic-ui-react';
import { MobileDropDownNav } from '../../../../theme/shared';
import { NavItems } from '../../../../theme/layout/NavigationItems';
import { DataFormatter } from '../../../../helper';
import TermNotes from './fundingOptions/TermNotes';
import RevenueSharingNotes from './fundingOptions/RevenueSharingNotes';
import PreferredEquity from './fundingOptions/PreferredEquity';

const navItems = [
  { title: 'Term Notes', to: 'term-notes', component: TermNotes },
  { title: 'Revenue Sharing Notes', to: 'revenue-sharing-notes', component: RevenueSharingNotes },
  { title: 'Preferred Equity', to: 'preferred-equity', component: PreferredEquity },
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
        <section className="funding-option">
          <Container>
            <Grid centered>
              <Grid.Column computer={15} tablet={16} mobile={16} textAlign={isMobile ? 'left' : 'center'}>
                <Header as="h2">
                  Choose a funding option that fits your business.
                </Header>
                <p className={isMobile ? 'mb-10' : 'mb-50'}>
                  Whether you’re raising capital for an expansion, a new venture or to improve your
                  current capacity, our financial products put you in control. Grow your business
                  with people who can support your growth. Note that all options provided are for
                  informational purposes only. Each business is unique, and specific terms may vary
                  based on facts and circumstances of each business. Contact us to find a solution
                  that works best for your business.
                </p>
              </Grid.Column>
            </Grid>
            <Responsive minWidth={768} as={Menu} tabular fluid widths={3}>
              <NavItems sub refLoc="public" location={location} navItems={navItems} />
            </Responsive>
            <MobileDropDownNav
              refMatch={match}
              navItems={navItems}
              location={location}
              slideUpNot
            />
            <Segment attached="bottom" padded>
              <Switch>
                <Route
                  exact
                  path={match.url}
                  component={navItems[0].component}
                />
                {
                  navItems.map(item => (
                    <Route
                      key={item.to}
                      path={`${match.url}/${item.to}`}
                      component={item.component}
                    />
                  ))
                }
              </Switch>
            </Segment>
            <Divider />
            <List className="learn-more-list">
              <List.Item>
                <List.Content as={Link} to="/business/process" className="text-uppercase" floated="right">
                  <b>Process</b>
                  <List.Icon className="ns-arrow-right" color="green" />
                </List.Content>
              </List.Item>
            </List>
          </Container>
        </section>
      </Aux>
    );
  }
}
