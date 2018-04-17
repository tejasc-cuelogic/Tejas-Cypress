import React from 'react';
import { Grid, GridColumn, Checkbox, Card } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class FileSelector extends React.Component {
  handleChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent);
  };

  render() {
    return (
      <Card fluid className="form-card">
        <Grid>
          <Grid.Row>
            <Grid stackable columns={2}>
              {
                _.map(this.props.businessStore.documentList, file => (
                  <GridColumn key={file.name}>
                    <Checkbox
                      label={file.name}
                      name={file.name}
                      checked={file.checked}
                      onChange={this.handleChange}
                    />
                  </GridColumn>
                ))
              }
            </Grid>
          </Grid.Row>
        </Grid>
      </Card>
    );
  }
}
