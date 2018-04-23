/*  eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { observer } from 'mobx-react';
import { Grid, Icon } from 'semantic-ui-react';

const FileUploaderVertical = observer((props) => {
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
            {value}
          <Icon name="remove" onClick={() => props.removeUploadedDocument(props.name)} />
        </div>
        }
      </Grid.Column>
    </Grid.Row>
  );
});

export default FileUploaderVertical;
