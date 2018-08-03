import React from 'react';

const emptyDataSet = props => (
  <div>
    {props.title ? props.title : 'No data available'}
  </div>
);

export default emptyDataSet;
