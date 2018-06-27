import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';

const CipErrors = observer((props) => {
  if (_.isEmpty(props.errorsList)) {
    return null;
  }
  return (
    <ul className="error-messages">
      { _.map(props.errorsList, error => <li key={error.key}>{error.message}</li>) }
    </ul>
  );
});

export default CipErrors;
