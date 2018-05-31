import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Button } from 'semantic-ui-react';
import FieldError from '../common/FieldError';

const FileUploaderLarge = observer((props) => {
  const {
    value,
    error,
  } = props.fielddata;
  return (
    <Form.Field>
      {!value &&
        <div className="file-uploader">
          <div><Icon className="ns-upload" /> Choose a file <span>or drag it here</span></div>
          <input
            name={props.name}
            type="file"
            onChange={e => props.uploadDocument(e.target.name, e.target.files)}
          />
        </div>
      }
      {value &&
        <div className="file-uploader attached">
          <span title={value}>{value}</span>
          <Button size="tiny" compact className="remove pull-right" onClick={() => props.uploadDocument(props.name, '')}>Remove</Button>
        </div>
      }
      {error &&
        <div className="center-align">
          <FieldError className="center-align" error={error} />
        </div>
      }
    </Form.Field>
  );
});

export default FileUploaderLarge;
