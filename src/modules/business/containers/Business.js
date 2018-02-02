import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

@inject('businessStore', 'userStore')
@observer
@withRouter
class Business extends Component {
  handleEdgarFormClick = () => this.props.history.push('/business/edgar')

  render() {
    return (
      <div className="ui one column grid">
        <div>
          <Button onClick={this.handleEdgarFormClick} floated="right">New Business</Button>
        </div>
        <div
          className="column"
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
