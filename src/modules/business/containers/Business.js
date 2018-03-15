import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

import businessActions from '../../../actions/business';
import BusinessList from '../components/BusinessList';

@withRouter
@inject('businessStore')
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
                <Button color="green" as={Link} to="/app/business/new" floated="right">New Offering</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <BusinessList
          businessList={this.props.businessStore.businessList}
        />
      </div>

      // <div className="ui one column grid">
      //   <div className="column">
      //     <Button color="green" as={Link} to="/app/business/new"
      //      floated="right">New Offering</Button>
      //   </div>
      //   <div
      //     className="column nsContent"
      //     style={{
      //       fontSize: '30px',
      //       color: '#666',
      //       top: '25px',
      //       textAlign: 'center',
      //     }}
      //   >
      //     <BusinessList
      //       businessList={this.props.businessStore.businessList}
      //     />
      //   </div>
      // </div>
    );
  }
}

export default Business;
