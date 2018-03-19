import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Divider, Button, Grid, Icon } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FilerInformation from './xmlFormContainers/FilerInformation';
import IssuerInformation from './xmlFormContainers/IssuerInformation';
import OfferingInformation from './xmlFormContainers/OfferingInformation';
import AnnualReportDisclosureRequirements from './xmlFormContainers/AnnualReportDisclosureRequirements';
import Signature from './xmlFormContainers/Signature';
import FileSelector from './xmlFormContainers/FileSelector';
import businessActions from '../../../actions/business';
import Spinner from '../../../theme/ui/Spinner';
import Alert from '../../../helper/utility';

@inject('businessStore', 'uiStore')
@observer
export default class XmlForm extends React.Component {
  componentDidMount() {
    this.props.businessStore.setBusinessId(this.props.match.params.businessId);
    this.props.businessStore.setFilingId(this.props.match.params.filingId);
    businessActions.getFiles(this.props.match.params)
      .then(() => {
        if (this.props.match.params.xmlId) {
          businessActions.fetchXmlDetails(this.props.match.params);
        }
      });
  }

  handleUrlChange = (e, { value }) => {
    this.props.businessStore.setOfferingUrl(value);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    businessActions.generateXml()
      .then(() => {
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Alert.notify('Successfully submitted XML form.', 'success');
      })
      .finally(() => {
        this.props.uiStore.setProgress(false);
        this.props.uiStore.clearLoaderMessage();
      });
  };

  render() {
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>
                  <Link to={`/app/business/${this.props.match.params.businessId}`} className="back-link"><Icon name="long arrow left" /></Link>
                  XML Form
                </h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <Form className="edgar-form">
            <Form.Group widths="equal">
              <Form.Input
                label="Website URL"
                value={this.props.businessStore.offeringUrl}
                onChange={this.handleUrlChange}
                className="column"
                width={8}
              />
            </Form.Group>
            <FilerInformation />
            <IssuerInformation />
            <OfferingInformation />
            <AnnualReportDisclosureRequirements />
            <Signature />
            <FileSelector />
            <Divider section />
            <div
              className="form-footer"
              style={{
                paddingBottom: '40px',
              }}
            >
              <Button color="green" size="large" onClick={this.handleFormSubmit}>
                Submit
              </Button>
              <Button as={Link} size="large" to={`/app/business/${this.props.match.params.businessId}`}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
