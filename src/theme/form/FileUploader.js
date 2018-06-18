/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Icon, Button, Responsive } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FileUploader = observer((props) => {
  const { label, error, value } = props.fielddata;
  return (
    <div className="file-uploader-wrap">
      {label &&
        <label>{label}</label>
      }
      {!value &&
        <div className="file-uploader">
          <Icon className="ns-upload" /> Choose a file <span>or drag it here</span>
          <input
            name={props.name}
            type="file"
            onChange={e => props.uploadDocument(e.target.name, e.target.files)}
          />
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
          onClick={() => props.removeUploadedDocument(props.name)}
        >
          Remove
        </Responsive>
        <Responsive
          as={Icon}
          maxWidth={767}
          name="remove"
          className="pull-right"
          onClick={() => props.removeUploadedDocument(props.name)}
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

export default FileUploader;
