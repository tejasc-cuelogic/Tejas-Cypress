import React from 'react';
import Moment from 'react-moment';
import { DATE_FORMAT, DATE_ONLY } from '../../../constants/common';

const dateTimeFormat = props => (
  <>
    {props.fromNow ? (
      <Moment fromNow unix={props.unix}>{new Date(props.datetime)}</Moment>
    ) : (
      props.dateonly
        ? <Moment unix={props.unix} format={DATE_ONLY}>{new Date(props.datetime)}</Moment> : (
          props.format
            ? <Moment unix={props.unix} format={props.format}>{new Date(props.datetime)}</Moment>
            : props.isCSTFormat ? <span>{' '} {props.datetime}</span>
              : <Moment format={DATE_FORMAT}>{new Date(props.datetime)}</Moment>
        )
    )
    }
  </>
);

export default dateTimeFormat;
