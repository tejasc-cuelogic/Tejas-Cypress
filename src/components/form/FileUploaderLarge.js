import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon, Button } from 'semantic-ui-react';

const FileUploaderLarge = observer((props) => {
  const {
    value,
  } = props.fielddata;
  return (
    <Form.Field>
      {value === '' &&
        <div className="file-uploader">
          <div><Icon className="ns-upload" /> Choose a file <span>or drag it here</span></div>
          <input
            name={props.name}
            type="file"
            onChange={e => props.uploadDocument(e.target.name, e.target.files)}
          />
        </div>
      }
      {value !== '' &&
        <div className="file-uploader attached">
          <span title={value}>{value}</span>
          <Button size="tiny" compact className="remove pull-right" onClick={() => props.removeUploadedDocument(props.name)}>Remove</Button>
        </div>
      }
    </Form.Field>
  );
});

export default FileUploaderLarge;
