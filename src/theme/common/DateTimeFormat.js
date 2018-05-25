import React from 'react';
import Aux from 'react-aux';
import Moment from 'react-moment';
import { DATE_FORMAT, DATE_ONLY } from '../../constants/common';

const dateTimeFormat = props => (
  <Aux>
    {props.fromNow ? (
      <Moment fromNow>{props.datetime}</Moment>
    ) : (
      props.dateonly ? <Moment format={DATE_ONLY}>{props.datetime}</Moment> :
      <Moment format={DATE_FORMAT}>{props.datetime}</Moment>
    )
    }
  </Aux>
);

export default dateTimeFormat;
