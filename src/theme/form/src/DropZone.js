/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Responsive, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { FieldError } from '../../shared';

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
      {!value.length || props.multiple ?
        <div className="file-uploader">
          <Dropzone onDrop={files => props.ondrop(files, props.name)} className="test" style={{}}>
            <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
          </Dropzone>
        </div> : null
      }
      {(value && value.length) ?
        value.map((item, key) => (
          <div className="file-uploader attached">
            <Responsive
              as={Button}
              minWidth={768}
              size="tiny"
              compact
              className="remove pull-right"
              onClick={e => props.onremove(e, props.name, key)}
            >
              Remove
            </Responsive>
            <Responsive
              as={Icon}
              maxWidth={767}
              name="remove"
              className="pull-right"
              onClick={e => props.onremove(e, props.name, key)}
            />
            <span title={item}>{item}</span>
          </div>
        )) : null
      }
      {error &&
        <FieldError error={error} />
      }
    </div>
  );
});

export default DropZone;
