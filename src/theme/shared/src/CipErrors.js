import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { observer } from 'mobx-react';

const CipErrors = observer((props) => {
  if (isEmpty(props.errorsList)) {
    return null;
  }
  return (
    <ul className="error-messages">
      { props.errorsList.map(error => <li key={error.key}>{error.message}</li>) }
    </ul>
  );
});

export default CipErrors;
