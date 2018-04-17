import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Grid, Icon, Message } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';

import FilerInformation from './xmlFormContainers/FilerInformation';
import IssuerInformation from './xmlFormContainers/IssuerInformation';
import OfferingInformation from './xmlFormContainers/OfferingInformation';
import AnnualReportDisclosureRequirements from './xmlFormContainers/AnnualReportDisclosureRequirements';
import XmlTabs from '../components/XmlTabs';
import Signature from './xmlFormContainers/Signature';
import FileSelector from './xmlFormContainers/FileSelector';
import businessActions from '../../../actions/business';
import Spinner from '../../../theme/ui/Spinner';
import Helper from '../../../helper/utility';
import ListErrors from '../../../components/common/ListErrors';
// import FieldError from '../../../components/common/FieldError';
import FormErrors from '../../../components/common/FormErrors';

@inject('businessStore', 'uiStore')
@observer
export default class XmlForm extends React.Component {
  constructor() {
    super();
    this.state = {
      errors: [],
    };
  }

  componentDidMount() {
    this.props.businessStore.setXmlActiveTabId(0);
    this.props.businessStore.setBusinessId(this.props.match.params.businessId);
    this.props.businessStore.setFilingId(this.props.match.params.filingId);
    businessActions.getFiles(this.props.match.params)
      .then(() => {
        if (this.props.match.params.xmlId) {
          businessActions.fetchXmlDetails(this.props.match.params);
        }
      });
  }

  componentWillUnmount() {
    this.props.uiStore.reset();
    // this.props.businessStore.setOfferingUrl('');
    this.props.businessStore.clearFiler();
    this.props.businessStore.clearIssuer();
    this.props.businessStore.clearOffering();
    this.props.businessStore.clearAnnualReport();
    this.props.businessStore.clearSignature();
  }

  // handleUrlChange = (e, { value }) => {
  //   this.props.businessStore.setOfferingUrl(value);
  // }
  handleXmlActiveTab = (id) => {
    this.props.businessStore.setXmlActiveTabId(id);
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    businessActions.validateXmlForm();
    if (this.props.businessStore.canSubmitXmlForm) {
      businessActions.generateXml()
        .then(() => {
          this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
          Helper.toast('XML form submitted successfully', 'success');
        })
        .catch((err) => {
          this.setState({ errors: err.response.body.message });
          Helper.toast('Something went wrong while submitting XML Form, Please try again.', 'error', { position: 'top-center' });
        })
        .finally(() => {
          this.props.uiStore.setProgress(false);
          this.props.uiStore.clearLoaderMessage();
        });
    } else {
      Helper.toast('Form has validation errors', 'error', { position: 'top-center' });
    }
  };

  render() {
    const { xmlErrors, xmlSubmissionTabs, xmlActiveTabId } = this.props.businessStore;
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
          <Grid>
            <XmlTabs
              tabs={xmlSubmissionTabs}
              xmlId={this.props.match.params.xmlId}
              handleXmlActiveTab={this.handleXmlActiveTab}
              xmlActiveTabId={xmlActiveTabId}
            />
            <Grid.Column width={12}>
              <Form className="edgar-form">
                {xmlActiveTabId === 0 && <FilerInformation />}
                {xmlActiveTabId === 1 && <IssuerInformation />}
                {xmlActiveTabId === 2 && <OfferingInformation />}
                {xmlActiveTabId === 3 && <AnnualReportDisclosureRequirements />}
                {xmlActiveTabId === 4 && <FileSelector />}
                {xmlActiveTabId === 5 && <Signature />}
                {this.state.errors && this.state.errors.message &&
                  <Message error textAlign="left">
                    <ListErrors errors={[this.state.errors.message.errors]} />
                  </Message>
                }
              </Form>
            </Grid.Column>
          </Grid>
          <FormErrors xmlErrors={xmlErrors} className="field-error-message" />
          {/* <Form className="edgar-form">
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
              <Button as={Link} size="large"
              to={`/app/business/${this.props.match.params.businessId}`}>Cancel</Button>
            </div>
            {this.state.errors && this.state.errors.message &&
              <Message error textAlign="left">
                <ListErrors errors={[this.state.errors.message.errors]} />
              </Message>
            }
          </Form> */}
        </div>
      </div>
    );
  }
}
