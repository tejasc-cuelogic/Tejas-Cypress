import React from 'react';
import { Grid, GridColumn, Checkbox, Card, Divider, Button, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect

import busiessActions from '../../../../actions/business';
import Helper from '../../../../helper/utility';

@inject('businessStore')
@withRouter
@observer
export default class FileSelector extends React.Component {
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  handleChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent);
  };

  handleBusinessCancel = () => {
    this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
  }

  handleFileSelectorSubmit = (e) => {
    e.preventDefault();
    const { documentList } = this.props.businessStore;
    busiessActions.validateDocumentList(documentList);
    if (this.props.businessStore.xmlErrors
      && this.props.businessStore.xmlErrors.documentListError === undefined) {
      busiessActions.submitXMLInformation('documentList')
        .then((data) => {
          this.props.businessStore.setXmlError();
          if (this.props.businessStore.xmlSubmissionId === 'undefined') {
            const { xmlSubmissionId } = data.body.data.upsertFilerInformation;
            this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
          }
          Helper.toast('Document selection submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          <Button color="green" size="large" className="pull-left" onClick={() => this.props.businessStore.setXmlActiveTabId(4)}>
            <Icon name="chevron left" />
            Back
          </Button>
          <Button size="large" onClick={this.handleBusinessCancel}>Cancel</Button>
          <Button color="green" size="large" onClick={this.handleFileSelectorSubmit}>
            Save
          </Button>
        </div>
      </div>
    );
  }
}
