import React, { Component } from 'react';
import { Grid, Card, Button, Divider } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import ActivityHistory from '../../../shared/ActivityHistory';
import SecondaryMenu from '../../../../../theme/layout/SecondaryMenu';

@inject('accreditationStore')
@withRouter
@observer
export default class ElasticSearch extends Component {
  componentWillMount() {
    // if (this.props.match.isExact) {
    //   this.props.accreditationStore.initRequest();
    // }
  }
  render() {
    const { match } = this.props;
    const navItems = [
      { title: 'Activity History', to: 'activity-history' },
    ];
    return (
      <Grid>
        <Grid.Column width={4}>
          <Card fluid>
            <Card.Content header="Users Index" />
            <Card.Content>
              <Card.Description>
                <Button.Group compact>
                  <Button size="mini" content="Create" primary />
                  <Button size="mini" content="Generate" secondary />
                </Button.Group>
                <Divider hidden />
                <Button.Group compact>
                  <Button size="mini" content="Update" primary />
                  <Button size="mini" content="Delete" color="red" />
                </Button.Group>
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column width={12}>
          <div className="sticky-sidebar">
            <Card fluid>
              <SecondaryMenu match={match} navItems={navItems} />
              <ActivityHistory />
            </Card>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}
