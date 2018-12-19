import React from 'react';
import Parser from 'html-react-parser';

class ListErrors extends React.Component {
  render() {
    const { errors } = this.props;
    if (errors) {
      return (
        errors.length === 1 ? (
          <p>{Parser(errors[0] || '')}</p>
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
