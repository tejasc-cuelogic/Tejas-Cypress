/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Responsive, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { FieldError } from '../../common';

const DropZone = observer((props) => {
  const {
    label,
    value,
    error,
  } = props.fielddata;
  return (
    <div className="file-uploader-wrap">
      {label &&
        <label>{label}</label>
      }
      {!value &&
      <div className="file-uploader">
        <Dropzone onDrop={props.ondrop} className="test" style={{}}>
          <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
        </Dropzone>
      </div>
      }
      {value &&
      <div className="file-uploader attached">
        <Responsive
          as={Button}
          minWidth={768}
          size="tiny"
          compact
          className="remove pull-right"
          onClick={e => props.onremove(e, props.name)}
        >
          Remove
        </Responsive>
        <Responsive
          as={Icon}
          maxWidth={767}
          name="remove"
          className="pull-right"
          onClick={e => props.onremove(e, props.name)}
        />
        <span title={value}>{value}</span>
      </div>
      }
      {error &&
        <FieldError error={error} />
      }
    </div>
  );
});

export default DropZone;
