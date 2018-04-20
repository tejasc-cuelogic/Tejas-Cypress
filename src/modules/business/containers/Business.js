import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, Input, Button, List, Form, Icon } from 'semantic-ui-react';

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
  componentWillUnmount() {
    this.props.uiStore.reset();
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
        <div className="page-header-section">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={6}>
                <h1>Manage Businesses</h1>
              </Grid.Column>
              <Grid.Column width={5}>
                <Form inverted>
                  <Input fluid inverted icon="ns-search" iconPosition="left" placeholder="Type Business’s name, description" />
                </Form>
              </Grid.Column>
              <Grid.Column width={2} textAlign="center">
                <span className="filter-count">0</span>
                <Button icon color="green" className="link-button">
                  Filters <Icon name="ns-caret-down" />
                </Button>
              </Grid.Column>
              <Grid.Column width={3} textAlign="right">
                <NewBusinessForm />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        {/* Filters will be here for Business Listing */}
        {/* <div className="search-filters">
          <Grid stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <h5>Account Type</h5>
                <Dropdown className="inverted" placeholder="Select Filter"
                fluid multiple selection options={accountType} />
              </Grid.Column>
              <Grid.Column width={3}>
                <h5>Status</h5>
                <Dropdown className="inverted" placeholder="Select Filter"
                fluid multiple selection options={status} />
              </Grid.Column>
              <Grid.Column width={3}>
                <h5>Accridiation</h5>
                <Dropdown className="inverted" placeholder="Select Filter"
                fluid multiple selection options={accridiation} />
              </Grid.Column>
              <Grid.Column width={4}>
                <h5>Creation date</h5>
                <Form>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <Input fluid icon="ns-calendar" iconPosition="left"
                      placeholder="01/01/2017" />
                    </Form.Field>
                    <Form.Field>
                      <Input fluid icon="ns-calendar" iconPosition="left"
                      placeholder="01/01/2018" />
                    </Form.Field>
                  </Form.Group>
                </Form>
              </Grid.Column>
              <Grid.Column width={3}>
                <h5>City</h5>
                <Dropdown className="inverted" placeholder="Select Filter" fluid
                multiple selection options={city} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div> */}
        <div className="filter-meta">
          <Grid stackable>
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
        <BusinessList
          businessList={this.props.businessStore.businessList}
        />
      </div>
    );
  }
}

export default Business;
