import React from 'react';

export default class StepOne extends React.Component {
  // constructor () {
  //   super()
  //   this.state = {
  //     firstName: '',
  //     lastName: ''
  //   }
  //   this.handleFirstNameChanged = this.handleFirstNameChanged.bind(this);
  //   this.handleLastNameChanged = this.handleLastNameChanged.bind(this);
  // }

  // handleFirstNameChanged (event) {
  //   this.setState({firstName: event.target.value})
  // }

  // handleLastNameChanged (event) {
  //   this.setState({lastName: event.target.value})
  // }

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
            <label>Last Name</label>
            <input
              className="u-full-width"
              placeholder="Last Name"
              type="text"
            />
          </div>
        </div>
      </div>
    );
  }
}
