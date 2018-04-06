import React from 'react';

export default class StepTwo extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="six columns">
            { /*  eslint-disable jsx-a11y/label-has-for */ }
            <label>Your email</label>
            <input
              className="u-full-width required"
              placeholder="test@mailbox.com"
              type="email"
            />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <label>Confirm email</label>
            <input
              className="u-full-width"
              placeholder="Confirm email"
              type="email"
            />
          </div>
        </div>
      </div>
    );
  }
}
