import React, { Component } from 'react';
import { Modal, Header, Card, Menu } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import Loadable from 'react-loadable';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import { InlineLoader } from '../../../../../theme/shared';

const navItems = [
  { title: 'General Conditions', to: 'general-conditions' },
  { title: 'Summary of Fees', to: 'summary-of-fees' },
  { title: 'Tax Reporting', to: 'tax-reporting' },
  { title: 'Payment Chart', to: 'payment-chart' },
];

const getModule = component => Loadable({
  loader: () => import(`./tabs/${component}`),
  loading() {
    return <InlineLoader />;
  },
});
export default class ChooseOffer extends Component {
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    return (
      <Modal open closeIcon onClose={this.handleCloseModal} size="large" closeOnDimmerClick={false}>
        <Modal.Content>
          <Header as="h4">Choose from campaign offers</Header>
          <p>Please read more about offer details and choose one to sign in and proceed.</p>
          <p>You have one month from the date of this Approval Letter to accept your Approved
            Terms before they expire. You may accept by circling the preferred Option above and
            signing the Portal Agreement to formalize our partnership and initiate the preparation
            of your crowdfunding campaign.
          </p>
          <Header as="h3">Offer cards will go here</Header>
          <Card fluid>
            <SecondaryMenu
              inverted
              match={match}
              navItems={navItems}
              rightLabel={<Menu.Item header position="right">Offer A</Menu.Item>}
            />
            <div className="inner-content-spacer">
              <Switch>
                <Route
                  exact
                  path={match.url}
                  component={getModule(this.module(navItems[0].title))}
                />
                {
                  navItems.map(item => (
                    <Route exact={false} key={item.to} path={`${match.url}/${item.to}`} component={getModule(this.module(item.title))} />
                  ))
                }
              </Switch>
            </div>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
