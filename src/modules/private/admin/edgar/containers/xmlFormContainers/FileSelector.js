/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import { Grid, GridColumn, Checkbox, Card, Header } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect
@inject('businessStore')
@withRouter
@observer
export default class FileSelector extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  handleChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent, true);
  };

  render() {
    return (
      <div>
        <Card fluid className="form-card">
          <Header as="h5">Uploads to include as attachments to the XML Generation
            <a
              href={this.props.businessStore.boxFolderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="highlight-text pull-right"
            >
              <small>Documents</small>
            </a>
          </Header>
          <Grid>
            <Grid.Row>
              <Grid stackable columns={2}>
                {
                  _.map(this.props.businessStore.formDocumentInfo.documentList, file => (
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
      </div>
    );
  }
}
