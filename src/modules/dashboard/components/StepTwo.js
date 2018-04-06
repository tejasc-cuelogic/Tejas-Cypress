import React from 'react';

export class StepTwo extends React.Component {
//   constructor () {
//     super()
//     this.state = {
//       email: '',
//       emailConfirm: ''
//     }
//     this.handleEmailChanged = this.handleEmailChanged.bind(this);
//     this.handleEmailConfirmChanged = this.handleEmailConfirmChanged.bind(this);
//   }

//   handleEmailChanged (event) {
//     this.setState({email: event.target.value})
//   }

//   handleEmailConfirmChanged (event) {
//     this.setState({emailConfirm: event.target.value})
//   }

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
