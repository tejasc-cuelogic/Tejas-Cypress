import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Modal, Card, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import Summary from '../components/Summary';
import {
  Overview,
  KeyTerms,
  Legal,
  Offering,
  Leadership,
  BonusRewards,
  Media,
  Close,
  Investors,
  Transactions,
} from '../../../shared/offerings/components';

const navItems = [
  { title: 'Overview', to: 'overview', component: Overview },
  { title: 'Key Terms', to: 'key-terms', component: KeyTerms },
  { title: 'Investors', to: 'investors', component: Investors },
  { title: 'Legal', to: 'legal', component: Legal },
  { title: 'Offering', to: 'offering', component: Offering },
  { title: 'Close', to: 'close', component: Close },
  { title: 'Media', to: 'media', component: Media },
  { title: 'Leadership', to: 'leadership', component: Leadership },
  { title: 'Transactions', to: 'transactions', component: Transactions },
  { title: 'Bonus Rewards', to: 'bonus-rewards', component: BonusRewards },
];

const summaryDetails = {
  summary: [
    { title: 'Created date', content: '3/15/2018', type: 0 },
    { title: 'Lead', content: 'Norbert Murray', type: 0 },
    { title: 'Days Till Launch', content: '34 days', type: 0 },
  ],
};

export default class OfferingDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  };
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    return (
      <Modal closeOnRootNodeClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">America Gardens</Header>
          <Summary details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={navItems[0].component} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={item.component} />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
