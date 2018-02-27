import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

@inject('businessStore', 'userStore')
@observer
@withRouter
class Business extends Component {
  render() {
    return (
      <div className="ui one column grid">
        <div className="column">
          <Button color="green" as={Link} to="/app/business/xml" floated="right">New XML</Button>
          <Button color="green" as={Link} to="/app/business/edgar" floated="right">New Business</Button>
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
          <span className="title">NextSeed for Businesses</span>
          <span className="infotext">Let your community invest in your success</span>
        </div>
      </div>
    );
  }
}

export default Business;
