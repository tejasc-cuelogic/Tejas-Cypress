import React from 'react';
import Aux from 'react-aux';
import Moment from 'react-moment';
import { DATE_FORMAT, DATE_ONLY } from '../../../constants/common';

const dateTimeFormat = props => (
  <Aux>
    {props.fromNow ? (
      <Moment fromNow unix={props.unix}>{new Date(props.datetime)}</Moment>
    ) : (
      props.dateonly ?
        <Moment unix={props.unix} format={DATE_ONLY}>{new Date(props.datetime)}</Moment> : (
        props.format
          ? <Moment unix={props.unix} format={props.format}>{new Date(props.datetime)}</Moment> :
          <Moment format={DATE_FORMAT}>{new Date(props.datetime)}</Moment>
      )
    )
    }
  </Aux>
);

export default dateTimeFormat;
