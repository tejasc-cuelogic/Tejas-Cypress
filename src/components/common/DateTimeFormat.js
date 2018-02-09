import React from 'react';
import Aux from 'react-aux';
import Moment from 'react-moment';
import { DATE_FORMAT } from '../../constants/common';

const dateTimeFormat = props => (
  <Aux>
    <Moment className={props.datetime} format={DATE_FORMAT}>{props.datetime}</Moment>
    <Moment className="ui mini label" fromNow>{props.datetime}</Moment>
  </Aux>
);

export default dateTimeFormat;
