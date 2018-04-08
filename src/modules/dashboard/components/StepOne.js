import React from 'react';
import PlaidLink from 'react-plaid-link';

export default class StepOne extends React.Component {
  handleOnSuccess = (token, metadata) => {
    // send token to client server
    console.log(token, metadata);
  }
  render() {
    return (
      <div>
        <div className="row">
          <div className="six columns">
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>First Name</label>
            <input
              className="u-full-width"
              placeholder="First Name"
              type="text"
            />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            {/* <label>Last Name</label>
            <input
              className="u-full-width"
              placeholder="Last Name"
              type="text"
            /> */}
            <PlaidLink
              clientName="Plaid Client"
              // env="sandbox"
              product={['auth']}
              publicKey="614be98f819e9bd8d0db9abec1c08a"
              apiVersion="v2"
              onSuccess={this.handleOnSuccess}
              // onExit={this.handleOnExit}
              // onEvent={this.handleOnEvent}
              // onLoad={this.handleOnLoad}
            >
              Open Plaid Link button
            </PlaidLink>
          </div>
        </div>
      </div>
    );
  }
}
