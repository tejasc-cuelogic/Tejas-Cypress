import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, Input, Button, List, Form, Icon } from 'semantic-ui-react';

import ListErrors from '../../../components/common/ListErrors';
import SuccessMessage from '../../../components/common/SuccessMessage';
import businessActions from '../../../actions/business';
import BusinessList from '../components/BusinessList';
import NewBusinessForm from './NewBusinessForm';
import Spinner from '../../../theme/ui/Spinner';

@withRouter
@inject('businessStore', 'uiStore')
@observer
class Business extends Component {
  componentWillMount() {
    businessActions.listBusinesses();
  }
  render() {
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={4}>
                <h1>Manage Businesses</h1>
              </Grid.Column>
              <Grid.Column width={6}>
                <Form inverted>
                  <Input fluid inverted icon="search" iconPosition="left" placeholder="Type Business’s name, description" />
                </Form>
              </Grid.Column>
              <Grid.Column width={3} textAlign="center">
                <span className="filter-count">0</span>
                <Button to="" inverted icon color="green" className="link-button">
                  FILTERS <Icon name="caret down" />
                </Button>
              </Grid.Column>
              <Grid.Column width={3} textAlign="right">
                <NewBusinessForm />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <List horizontal relaxed>
                  <List.Item>
                    Showing <strong>{this.props.businessStore.getSummary}</strong> records
                  </List.Item>
                  <List.Item as="a" to="/users/new">No filters applied</List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <ListErrors errors={this.props.uiStore.errors} />
        <SuccessMessage success={this.props.uiStore.success} />
        <BusinessList
          businessList={this.props.businessStore.businessList}
        />
      </div>
    );
  }
}

export default Business;
