import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { Modal, Card, Header, Label, Rating, Button, Grid, List, Icon } from 'semantic-ui-react';
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
      <Modal closeIcon size="large" dimmer="inverted" open onClose={this.handleCloseModal} centered={false}>
        <Modal.Content className="transaction-detials">
          <Header as="h3">
            California 88 Application
            <span className="title-meta">Status: <b>Completed</b></span>
            <Label size="small" color="green">Reviewed</Label>
            <span className="title-meta">Rating</span>
            <Rating size="huge" disabled defaultRating={3} maxRating={5} />
            <Button secondary compact floated="right" content="Promote" />
          </Header>
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>
                    Information
                    <small className="pull-right"><Link to="/"><Icon className="ns-pencil" />Edit</Link></small>
                  </Card.Header>
                  <Card.Content>
                    <Grid columns={2}>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Business Name</Header.Subheader>
                          California 88
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Sign-up Code</Header.Subheader>
                          joedoe
                        </Header>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>Primary POC</Card.Header>
                  <Card.Content>
                    <Grid columns={2}>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Name</Header.Subheader>
                          John Doe
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Email</Header.Subheader>
                          jdoe234@gmail.com
                        </Header>
                      </Grid.Column>
                      <Grid.Column>
                        <Header as="h6">
                          <Header.Subheader>Phone</Header.Subheader>
                          235-343-6453
                        </Header>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid className="ba-info-card">
                  <Card.Header>Failed Reason</Card.Header>
                  <Card.Content>
                    <List bulleted relaxed>
                      <List.Item>Net income ($100) is lower than $15,000.</List.Item>
                      <List.Item>Net income ($100) is lower than $15,000.</List.Item>
                      <List.Item>Net income ($100) is lower than $15,000.</List.Item>
                    </List>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid.Row>
          </Grid>
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
