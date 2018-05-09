import React from 'react';
import Aux from 'react-aux';
import Moment from 'react-moment';
import { DATE_FORMAT } from '../../constants/common';

const dateTimeFormat = props => (
  <Aux>
    {props.fromNow ? (
      <Moment fromNow>{props.datetime}</Moment>
    ) : (
      <Moment format={DATE_FORMAT}>{props.datetime}</Moment>
    )
    }
  </Aux>
);
// <Moment className="ui mini label" fromNow>{props.datetime}</Moment>
export default dateTimeFormat;
