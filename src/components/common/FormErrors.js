import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';

const FormErrors = observer((props) => {
  if (_.isEmpty(props.xmlErrors)) {
    return null;
  }
  return (
    <div errors>
      { _.map(props.xmlErrors, error => <p>{error}</p>) }
    </div>
  );
});

export default FormErrors;
