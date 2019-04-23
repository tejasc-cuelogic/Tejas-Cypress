import React from 'react';
import Parser from 'html-react-parser';

const cleanMsg = (msg) => {
  try {
    return (msg ? msg.replace('GraphQL error: ', '') : msg);
  } catch (e) {
    return msg;
  }
};
class ListErrors extends React.Component {
  render() {
    const { errors } = this.props;
    if (errors) {
      return (
        errors.length === 1 ? (
          <p>{Parser(cleanMsg(typeof errors[0] !== 'string' ? errors[0].message : errors[0]) || '')}</p>
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
