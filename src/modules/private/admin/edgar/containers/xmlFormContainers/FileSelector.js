/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable no-undef */
import React from 'react';
import { Grid, GridColumn, Checkbox, Card, Header } from 'semantic-ui-react';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom'; // Redirect
import { NEXTSEED_BOX_URL, NEXTSEED_SECURITIES_BOX_URL } from './../../../../../../constants/common';

@inject('businessStore', 'offeringsStore')
@withRouter
@observer
export default class FileSelector extends React.Component {
  // componentWillMount() {
  //   if (!this.props.offeringsStore.initLoad.includes('getOne')) {
  //     this.props.offeringsStore.getOne(this.props.match.params.offeringId);
  //   }
  // }
  componentWillUnmount() {
    this.props.businessStore.setXmlError();
  }

  handleChange = (e) => {
    this.props.businessStore.toggleRequiredFiles(e.target.textContent, true);
  };

  render() {
    const { offer } = this.props.offeringsStore;
    // const offering = this.props.offeringDetails;
    const offeringRegulationArr = offer.regulation.split('_');
    const regulationType = offeringRegulationArr[0];
    const BOX_URL_TO_CONSIDER = regulationType === 'BD' ? NEXTSEED_SECURITIES_BOX_URL : NEXTSEED_BOX_URL;
    return (
      <div>
        <Card fluid className="form-card">
          <Header as="h5">Uploads to include as attachments to the XML Generation
            <a
              href={(`${BOX_URL_TO_CONSIDER}folder/${this.props.folderId}`)}
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
