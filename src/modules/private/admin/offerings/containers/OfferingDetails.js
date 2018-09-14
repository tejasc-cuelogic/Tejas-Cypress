import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route } from 'react-router-dom';
import { Modal, Card, Header } from 'semantic-ui-react';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';
import { DataFormatter } from '../../../../../helper';
import Summary from '../components/Summary';
import OfferingModule from '../../../shared/offerings/components';

const summaryDetails = {
  summary: [
    { title: 'Created date', content: '3/15/2018', type: 0 },
    { title: 'Lead', content: 'Norbert Murray', type: 0 },
    { title: 'Days Till Launch', content: '34 days', type: 0 },
  ],
};

@inject('navStore')
@observer
export default class OfferingDetails extends Component {
  componentWillMount() {
    if (this.props.match.isExact) {
      this.props.history.push(`${this.props.match.url}/overview`);
    }
    this.props.navStore.setAccessParams('specificNav', '/app/offering/2/overview');
  }
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.push(this.props.refLink);
  };
  module = name => DataFormatter.upperCamelCase(name);
  render() {
    const { match } = this.props;
    const navItems = this.props.navStore.specificNavs.subNavigations;
    return (
      <Modal closeOnRootNodeClick={false} closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">America Gardens</Header>
          <Summary details={summaryDetails} />
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={OfferingModule('overview')} />
              {
                navItems.map(item => (
                  <Route key={item.to} path={`${match.url}/${item.to}`} component={OfferingModule(item.to)} />
                ))
              }
            </Switch>
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
