import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Modal, Card, Header, Label, Rating } from 'semantic-ui-react';
import Loadable from 'react-loadable';
import { DataFormatter } from '../../../../../helper';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

const navItems = [
  { title: 'Activity History', to: 'activity-history' },
  { title: 'Pre-qualification', to: 'pre-qualification' },
];

const getModule = component => Loadable({
  loader: () => import(`../components/details/${component}`),
  loading() {
    return <div>Loading...</div>;
  },
});
export default class ApplicationDetails extends Component {
  module = name => DataFormatter.upperCamelCase(name);
  handleCloseModal = (e) => {
    e.stopPropagation();
    this.props.history.replace(this.props.refLink);
  };
  render() {
    const { match } = this.props;
    return (
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            California 88 Application
            <span className="title-meta">Status: Completed</span>
            <Label color="green">Reviewed</Label>
            <span className="title-meta">
              Rating <Rating size="large" disabled defaultRating={3} maxRating={5} />
            </span>
          </Header>
          <Card fluid>
            <SecondaryMenu match={match} navItems={navItems} />
            <Switch>
              <Route exact path={match.url} component={getModule(this.module(navItems[0].title))} />
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
          </Card>
        </Modal.Content>
      </Modal>
    );
  }
}
