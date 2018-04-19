import React from 'react';
import _ from 'lodash';
import { observer } from 'mobx-react';

const FormErrors = observer((props) => {
  const isErrorsObjectEmpty = !_.values(props.xmlErrors).some(error => error !== undefined);

  if (_.isEmpty(props.xmlErrors) || isErrorsObjectEmpty) {
    return null;
  }
  return (
    <div className="field-error-message">
      { _.map(props.xmlErrors, error => <p key={error}>{error}</p>) }
    </div>
  );
});

export default FormErrors;
