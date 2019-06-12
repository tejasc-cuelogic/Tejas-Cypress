/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Responsive, Button } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import { FieldError } from '../../shared';

const DropZone = observer((props) => {
  const {
    label,
    value,
    error,
  } = props.fielddata;
  return (
    <Form.Field>
      {label
        && <label>{label}</label>
      }
      {!value
      && (
      <div className="file-uploader">
        <Dropzone onDrop={props.ondrop} className="test" style={{}}>
          <div>
            <Icon className="ns-upload" />
            {' '}
Choose a file
            {' '}
            <span>or drag it here</span>
          </div>
        </Dropzone>
      </div>
      )
      }
      {value
      && (
      <div className="file-uploader attached">
        <Responsive
          as={Button}
          minWidth={768}
          size="tiny"
          compact
          className="ghost-button remove pull-right"
          onClick={() => props.onremove(props.name)}
        >
          Remove
        </Responsive>
        <Responsive
          as={Icon}
          maxWidth={767}
          name="remove"
          className="pull-right"
          onClick={() => props.onremove(props.name)}
        />
        <span title={value}>{value}</span>
      </div>
      )
      }
      {error
        && (
        <div className="center-align">
          <FieldError error={error} />
        </div>
        )
      }
    </Form.Field>
  );
});

export default DropZone;
