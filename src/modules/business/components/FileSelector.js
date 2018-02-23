import React from 'react';
import { Grid, GridColumn, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';

@inject('businessStore')
@observer
export default class FileSelector extends React.Component {
  render() {
    return (
      <div>
        <Grid stackable columns={2}>
          {
            _.map(this.props.businessStore.documentList, (value, type) => (
              <GridColumn>
                <Checkbox
                  label={type}
                  name={type}
                  checked={value}
                  onChange={this.props.handleCheckboxChange}
                />
              </GridColumn>
            ))
          }
        </Grid>
      </div>
    );
  }
}
