import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

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
      <div className="ui one column grid">
        <div className="column">
          <Button color="green" as={Link} to="/app/business/new" floated="right">New Offering</Button>
        </div>
        <div
          className="column nsContent"
          style={{
            fontSize: '30px',
            color: '#666',
            top: '25px',
            textAlign: 'center',
          }}
        >
          <BusinessList
            businessList={this.props.businessStore.businessList}
          />
        </div>
      </div>
    );
  }
}

export default Business;
