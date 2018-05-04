import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Grid, Icon, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

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
import FormErrors from '../../../components/common/FormErrors';
import {
  XML_STATUSES,
  XML_SUBMISSION_TABS,
} from '../../../constants/business';

@inject('businessStore', 'uiStore')
@observer
export default class XmlForm extends React.Component {
  componentDidMount() {
    this.props.businessStore.setXmlActiveTabName('filer');
    this.props.businessStore.setBusinessId(this.props.match.params.businessId);
    this.props.businessStore.setFilingId(this.props.match.params.filingId);
    this.props.businessStore.setXmlSubmissionId(this.props.match.params.xmlId);
    businessActions.getFiles(this.props.match.params)
      .then(() => {
        if (this.props.match.params.xmlId) {
          businessActions.fetchXmlDetails(this.props.match.params);
        } else {
          this.props.businessStore.setXmlSubmissionStatus(XML_STATUSES.draft);
        }
      });
  }

  componentWillUnmount() {
    this.props.uiStore.reset();
    this.props.businessStore.clearXmlSubStepsStatus();
    this.props.businessStore.clearFiler();
    this.props.businessStore.clearIssuer();
    this.props.businessStore.clearOffering();
    this.props.businessStore.clearAnnualReport();
    this.props.businessStore.clearSignature();
    this.props.businessStore.setXmlError();
  }

  handleValidationToActiveTab = (nextTabName) => {
    const {
      xmlActiveTabName,
      xmlSubmissionStatus,
    } = this.props.businessStore;
    const stepIndex = _.findIndex(XML_SUBMISSION_TABS, ['name', xmlActiveTabName]);

    if (xmlSubmissionStatus === XML_STATUSES.completed
      || xmlSubmissionStatus === XML_STATUSES.created) {
      this.rediurectToNextstep(nextTabName);
    } else if (xmlSubmissionStatus === XML_STATUSES.draft) {
      switch (XML_SUBMISSION_TABS[stepIndex].name) {
        case 'filer': {
          this.handleFilerInformationSubmit(xmlActiveTabName, nextTabName);
          break;
        }
        case 'issuer': {
          this.handleIssuerInformationSubmit(xmlActiveTabName, nextTabName);
          break;
        }
        case 'offering': {
          this.handleOfferingInformationSubmit(xmlActiveTabName, nextTabName);
          break;
        }
        case 'annual': {
          this.handleAnnualSubmit(xmlActiveTabName, nextTabName);
          break;
        }
        case 'signature': {
          this.handleSignatureSubmit(xmlActiveTabName, nextTabName);
          break;
        }
        default: {
          this.handleFileSelectorSubmit(xmlActiveTabName, nextTabName);
          break;
        }
      }
    }
  };

  rediurectToNextstep = (nextTabName) => {
    this.props.businessStore.setXmlActiveTabName(nextTabName);
  };

  updateBusinessStore = (params) => {
    this.props.businessStore.setXmlError();
    this.rediurectToNextstep(params.nextTabName);
    this.props.businessStore.setXmlSubStepsStatus(params.currentStepName, true);
    if (this.props.businessStore.xmlSubmissionId === undefined) {
      const { xmlSubmissionId } = params.data.upsertXmlInformation;
      this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
    }
  };

  handleFilerInformationSubmit = (currentStepName, nextTabName) => {
    const { filerInformation } = this.props.businessStore;
    businessActions.validateFilerInfo(filerInformation);

    if (this.props.businessStore.canSubmitFilerInfoXmlForm) {
      businessActions.submitXMLInformation('filerInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Filer information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  handleIssuerInformationSubmit = (currentStepName, nextTabName) => {
    const { issuerInformation } = this.props.businessStore;
    businessActions.validateIssuerInfo(issuerInformation);

    if (this.props.businessStore.canSubmitIssuerInfoXmlForm) {
      businessActions.submitXMLInformation('issuerInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Issuer information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleOfferingInformationSubmit = (currentStepName, nextTabName) => {
    const { offeringInformation } = this.props.businessStore;
    businessActions.validateOfferingInfo(offeringInformation);

    if (this.props.businessStore.canSubmitOfferingInfoXmlForm) {
      businessActions.submitXMLInformation('offeringInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Offering information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleAnnualSubmit = (currentStepName, nextTabName) => {
    const { annualReportRequirements } = this.props.businessStore;
    businessActions.validateAnnualReportInfo(annualReportRequirements);

    if (this.props.businessStore.canSubmitAnnualReportXmlForm) {
      businessActions.submitXMLInformation('annualReport')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Annual report disclosure requirements submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleSignatureSubmit = (currentStepName, nextTabName) => {
    const { signature } = this.props.businessStore;
    businessActions.validateSignatureInfo(signature);

    if (this.props.businessStore.canSubmitSigntureForm &&
      !_.includes(this.props.businessStore.canSubmitSignaturePersonsForm, false)) {
      businessActions.submitXMLInformation('signature')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Signature information submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleFileSelectorSubmit = (currentStepName, nextTabName) => {
    const { documentList } = this.props.businessStore;
    businessActions.validateDocumentList(documentList);
    if (this.props.businessStore.xmlErrors
      && this.props.businessStore.xmlErrors.documentListError === undefined) {
      businessActions.submitXMLInformation('documentList')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          Helper.toast('Document selection submitted successfully', 'success');
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleXmlSubmissionSubmit = () => {
    businessActions.submitXMLInformation('xmlSubmission')
      .then(() => {
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Helper.toast('XML form submitted successfully', 'success');
      })
      .catch((errors) => {
        this.props.businessStore.setXmlError(errors);
      });
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    businessActions.validateXmlForm();
    if (this.props.businessStore.canSubmitXmlForm) {
      businessActions.generateXml()
        .then(() => {
          this.props.businessStore.setXmlError();
          this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
          Helper.toast('XML form submitted successfully', 'success');
        })
        .catch((err) => {
          const newErrors = { ...this.props.businessStore.xmlErrors };
          Object.keys(err.response.body.errors).map((key) => {
            err.response.body.errors[key].map((element) => {
              newErrors[key] = element;
              return newErrors;
            });
            return err.response.body.errors;
          });
          this.props.businessStore.setXmlError(newErrors);
          // this.setState({ errors: err.response.body.errors });
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

  handleXmlSubmissionCopy = () => {
    this.props.uiStore.setProgress();
    this.props.uiStore.setLoaderMessage('Copy the XML submission');

    businessActions.copyXMLInformation()
      .then(() => {
        this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
        Helper.toast('Copy XML submission successfully', 'success');
      })
      .catch((error) => {
        console.log('Copy XML submission Error', error);
      });
  };

  render() {
    const {
      xmlErrors,
      xmlSubmissionTabs,
      xmlActiveTabName,
      xmlSubmissionId,
      xmlSubmissionStatus,
    } = this.props.businessStore;
    if (this.props.uiStore.inProgress) {
      return (
        <div>
          <Spinner loaderMessage={this.props.uiStore.loaderMessage} />
        </div>
      );
    }
    return (
      <div>
        <div className="page-header-section">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h1>
                  <Link to={`/app/business/${this.props.match.params.businessId}`} className="back-link"><Icon name="ns-arrow-left" /></Link>
                  XML Form
                  {
                    xmlSubmissionStatus === XML_STATUSES.completed &&
                    <Button
                      color="green"
                      floated="right"
                      onClick={this.handleXmlSubmissionCopy}
                    >
                      Copy XML Submission
                    </Button>
                  }
                  {
                    xmlSubmissionStatus === XML_STATUSES.draft &&
                    <Button
                      color="red"
                      size="large"
                      floated="right"
                      disabled={!this.props.businessStore.checkStepsStatus}
                      onClick={this.handleXmlSubmissionSubmit}
                    >
                      Submit
                    </Button>
                  }
                  {
                    xmlSubmissionStatus === XML_STATUSES.draft &&
                    <Button
                      color="green"
                      size="large"
                      floated="right"
                      disabled={
                        !this.props.businessStore.xmlSubStepsStatus[xmlActiveTabName]
                      }
                      onClick={() => this.handleValidationToActiveTab(xmlActiveTabName)}
                    >
                      Save
                    </Button>
                  }
                </h1>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <Grid>
            <XmlTabs
              tabs={xmlSubmissionTabs}
              xmlId={xmlSubmissionId}
              handleXmlActiveTab={this.handleValidationToActiveTab}
              xmlActiveTabName={xmlActiveTabName}
            />
            <Grid.Column width={12}>
              <Form className="edgar-form">
                {xmlActiveTabName === 'filer' && <FilerInformation />}
                {xmlActiveTabName === 'issuer' && <IssuerInformation />}
                {xmlActiveTabName === 'offering' && <OfferingInformation />}
                {xmlActiveTabName === 'annual' && <AnnualReportDisclosureRequirements />}
                {xmlActiveTabName === 'signature' && <Signature />}
                {xmlActiveTabName === 'doc' && <FileSelector />}
              </Form>
            </Grid.Column>
          </Grid>
          <FormErrors xmlErrors={xmlErrors} className="field-error-message" />
        </div>
      </div>
    );
  }
}
