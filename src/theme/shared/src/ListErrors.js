import React from 'react';
import Parser from 'html-react-parser';

const cleanMsg = msg => (msg ? msg.replace('GraphQL error: ', '') : '');
class ListErrors extends React.Component {
  render() {
    const { errors } = this.props;
    if (errors) {
      return (
        errors.length === 1 ? (
          <p>{Parser(cleanMsg(errors[0]) || '')}</p>
        ) : (
          <ul className="error-messages">
            {Object.keys(errors).map(key => <li key={key}>{cleanMsg(errors[key])}</li>)}
          </ul>
        )
      );
    }
    return null;
  }
}

export default ListErrors;
