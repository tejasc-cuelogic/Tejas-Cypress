import React from 'react';
import { observer } from 'mobx-react';
import { Form, Icon } from 'semantic-ui-react';

const FileUploaderInline = observer((props) => {
  const {
    value,
  } = props.fielddata;
  return (
    <Form.Field>
      {value === '' &&
        <div className="file-uploader">
          <Icon name="upload" /> Choose a file <span>or drag it here</span>
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
          <Icon name="remove" onClick={() => props.removeUploadedDocument(props.name)} />
        </div>
      }
    </Form.Field>
  );
});

export default FileUploaderInline;
