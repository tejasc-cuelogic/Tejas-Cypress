import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';

import ListErrors from '../../../components/common/ListErrors';
import SuccessMessage from '../../../components/common/SuccessMessage';
import businessActions from '../../../actions/business';
import BusinessList from '../components/BusinessList';
import NewBusinessForm from './NewBusinessForm';

@withRouter
@inject('businessStore', 'uiStore')
@observer
class Business extends Component {
  componentWillMount() {
    businessActions.listBusinesses();
  }
  render() {
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>
                <h3>Business</h3>
              </Grid.Column>
              <Grid.Column width={8}>
                <NewBusinessForm />
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
