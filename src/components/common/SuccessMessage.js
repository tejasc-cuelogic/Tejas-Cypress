import React from 'react';

class SuccessMessage extends React.Component {
  render() {
    const { success } = this.props;
    if (success) {
      return (
        <ul className="">
          <li>
            {success}
          </li>
        </ul>
      );
    }
    return null;
  }
}

export default SuccessMessage;
