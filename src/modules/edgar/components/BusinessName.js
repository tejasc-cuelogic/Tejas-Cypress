import React from 'react';
import { observer } from 'mobx-react';

const BusinessName = observer(props => {
  if (props.editingBusinessName) {
    return (
      
    );
  }
  return (

  );
});

export default BusinessName;