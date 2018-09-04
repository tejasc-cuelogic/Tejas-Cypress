import React, { Component } from 'react';
import Loadable from 'react-loadable';
import { Switch, Route } from 'react-router-dom';
import { Modal, Card } from 'semantic-ui-react';
import { InlineLoader } from '../../../../../../theme/shared';
import SecondaryMenu from '../../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../../helper';
import Summary from './Summary';

const navItems = [
  { title: 'Overview', to: 'overview' },
  { title: 'Key Terms', to: 'key-terms' },
  { title: 'Legal', to: 'legal' },
  { title: 'Offering', to: 'offering' },
  { title: 'Leadership', to: 'leadership' },
  { title: 'Bonus Rewards', to: 'bonus-rewards' },
];

const summaryDetails = {
  summary: [
    { title: 'Created date', content: '3/15/2018', type: 0 },
    { title: 'Lead', content: 'Norbert Murray', type: 0 },
    { title: 'Days Till Launch', content: '34 days', type: 0 },
  ],
};

const getModule = component => Loadable({
  loader: () => import(`./${component}`),
  loading() {
    return <InlineLoader />;
  },
});

export default class OfferingDetails extends Component {
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  };
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Summary details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route
                exact
                path={match.url}
                component={navItems[0].component || getModule(this.module(navItems[0].title))}
              />
              {
                navItems.map(item => (
                  <Route
                    key={item.to}
                    path={`${match.url}/${item.to}`}
                    component={item.component || getModule(this.module(item.title))}
                  />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
