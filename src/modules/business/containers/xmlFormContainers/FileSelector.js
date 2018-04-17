import React from 'react';
import { Grid, GridColumn, Checkbox, Card, Divider, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect

@inject('businessStore')
@withRouter
@observer
export default class FileSelector extends React.Component {
  handleChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent);
  };

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  render() {
    return (
      <div>
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
        <Divider hidden />
        <div className="right-align">
          <Button color="green" size="large" className="pull-left">
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          <Button color="green" size="large">
            Save & Next <Icon name="chevron right" />
          </Button>
        </div>
      </div>
    );
  }
}
