import React from 'react';
import { observer } from 'mobx-react';

const FillingsList = observer(props => (
  <div>
    {
      props.fillings.map(filling => (
        <div>
          <div>{filling.id}</div>
          <div>{JSON.stringify(filling.created)}</div>
        </div>
      ))
    }
  </div>
));

export default FillingsList;
