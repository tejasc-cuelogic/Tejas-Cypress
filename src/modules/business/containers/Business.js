import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import businessActions from '../../../actions/business';
import BusinessList from '../components/BusinessList';
import NewBusinessForm from './NewBusinessForm';

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
          <NewBusinessForm />
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
