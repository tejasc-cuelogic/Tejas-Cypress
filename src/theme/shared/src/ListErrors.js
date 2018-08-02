import React from 'react';

class ListErrors extends React.Component {
  render() {
    const { errors } = this.props;
    if (errors) {
      return (
        errors.length === 1 ? (
          <p>{errors[0]}</p>
        ) : (
          <ul className="error-messages">
            {Object.keys(errors).map(key => <li key={key}>{errors[key]}</li>)}
          </ul>
        )
      );
    }
    return null;
  }
}

export default ListErrors;
