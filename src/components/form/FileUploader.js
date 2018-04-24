/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Icon, Button } from 'semantic-ui-react';

const FileUploader = observer((props) => {
  const {
    label,
    sublabel,
    value,
  } = props.fielddata;
  return (
    <Grid.Row>
      <Grid.Column width={7}>
        <label>
          <h3>{label}</h3>
          {sublabel}
        </label>
      </Grid.Column>
      <Grid.Column width={9}>
        {value === '' &&
          <div className="file-uploader">
            <Icon name="ns-upload" /> Choose a file <span>or drag it here</span>
            <input
              name={props.name}
              type="file"
              onChange={e => props.uploadDocument(e.target.name, e.target.files)}
            />
          </div>
        }
        {value !== '' &&
        <div className="file-uploader attached">
          <Button size="tiny" compact className="remove pull-right" onClick={() => props.removeUploadedDocument(props.name)}>Remove</Button>
          <span title={value}>{value}</span>
        </div>
        }
      </Grid.Column>
    </Grid.Row>
  );
});

export default FileUploader;
