import React from 'react';

const EmptyDataSet = props => (
  <div>
    {props.title ? props.title : 'No data available'}
  </div>
);

export default EmptyDataSet;
