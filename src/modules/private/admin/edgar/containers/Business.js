import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid, Input, Form } from 'semantic-ui-react';
import PrivateLayout from '../../../shared/PrivateHOC';
import { businessActions } from '../../../../../services/actions';
import BusinessList from '../components/BusinessList';
import NewBusinessForm from './NewBusinessForm';
import { Spinner } from '../../../../../theme/shared';

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
      <PrivateLayout
        {...this.props}
        P1={(
<Grid.Column width={5}>
            <Form inverted>
              <Input fluid inverted icon="ns-search" iconPosition="left" placeholder="Type Business’s name, description" />
            </Form>
          </Grid.Column>
)}
        P3={<Grid.Column width={4} textAlign="right"><NewBusinessForm /></Grid.Column>}
      >
        <BusinessList businessList={this.props.businessStore.businessList} />
      </PrivateLayout>
    );
  }
}

export default Business;
