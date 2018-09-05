import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Header, Checkbox } from 'semantic-ui-react';
// import { FormCheckbox } from '../../../../../../theme/form';

export default class Overview extends Component {
  render() {
    return (
      <Form>
        <div className="inner-content-spacer">
          <Header as="h4">
            Launch Contingencies
            <Link to="/" className="link"><small>+ Add Launch Contingency</small></Link>
          </Header>
          <div className="featured-section">
            <Checkbox
              label="test"
              // values={
              //   { label: 'Fashion & Merchandising', value: 'FASHION_AND_APPAREL' }
              // }
              name="checkbox1"
              changed={this.handleTick}
              defaults
            />
          </div>
        </div>
      </Form>
    );
  }
}
