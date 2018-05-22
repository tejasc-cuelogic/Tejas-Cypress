import React from 'react';
import { Link } from 'react-router-dom';
import { Form, Grid, Icon, Button, Header } from 'semantic-ui-react';
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
import FormErrors from '../../../theme/common/FormErrors';
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
    this.props.businessStore.clearXmlTabsValue();
  }

  handleValidationToActiveTab = (nextTabName) => {
    const {
      xmlActiveTabName,
      xmlSubmissionStatus,
      formFilerInfo,
      formIssuerInfo,
      formOfferingInfo,
      formAnnualInfo,
      formSignatureInfo,
      formDocumentInfo,
    } = this.props.businessStore;
    const stepIndex = _.findIndex(XML_SUBMISSION_TABS, ['name', xmlActiveTabName]);

    if (xmlSubmissionStatus === XML_STATUSES.completed
      || xmlSubmissionStatus === XML_STATUSES.created) {
      this.redirectToNextstep(nextTabName);
    } else if (xmlSubmissionStatus === XML_STATUSES.draft) {
      switch (XML_SUBMISSION_TABS[stepIndex].name) {
        case 'filer': {
          if (!formFilerInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleFilerInformationSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
        case 'issuer': {
          if (!formIssuerInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleIssuerInformationSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
        case 'offering': {
          if (!formOfferingInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleOfferingInformationSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
        case 'annual': {
          if (!formAnnualInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleAnnualSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
        case 'signature': {
          if (!formSignatureInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleSignatureSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
        default: {
          if (!formDocumentInfo.meta.isDirty) {
            this.redirectToNextstep(nextTabName);
          } else {
            this.handleFileSelectorSubmit(xmlActiveTabName, nextTabName);
          }
          break;
        }
      }
    }
  };

  redirectToNextstep = (nextTabName) => {
    this.props.businessStore.setXmlActiveTabName(nextTabName);
  };

  updateBusinessStore = (params) => {
    this.props.businessStore.setXmlError();
    this.redirectToNextstep(params.nextTabName);
    this.props.businessStore.setXmlSubStepsStatus(params.currentStepName, true);
    if (this.props.businessStore.xmlSubmissionId === undefined) {
      const { xmlSubmissionId } = params.data.upsertXmlInformation;
      this.props.businessStore.setXmlSubmissionId(xmlSubmissionId);
    }
  };

  addAndRemoveErrorClass = (currentStep, errClass) => {
    const { xmlSubmissionTabs } = this.props.businessStore;
    const index = _.findIndex(xmlSubmissionTabs, ['name', currentStep]);
    this.props.businessStore.setXmlSubmissionTab(index, errClass);
  }

  handleFilerInformationSubmit = (currentStepName, nextTabName) => {
    const { formFilerInfo } = this.props.businessStore;
    businessActions.validateFilerInfo(formFilerInfo.fields);

    if (this.props.businessStore.canSubmitFilerInfoXmlForm) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('filerInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formFilerInfo.meta.isDirty = false;
          Helper.toast('Filer information submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while saving filer information, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  };

  handleIssuerInformationSubmit = (currentStepName, nextTabName) => {
    const { formIssuerInfo } = this.props.businessStore;
    businessActions.validateIssuerInfo(formIssuerInfo.fields);

    if (this.props.businessStore.canSubmitIssuerInfoXmlForm) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('issuerInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formIssuerInfo.meta.isDirty = false;
          Helper.toast('Issuer information submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while saving issuer information, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  }

  handleOfferingInformationSubmit = (currentStepName, nextTabName) => {
    const { formOfferingInfo } = this.props.businessStore;
    businessActions.validateOfferingInfo(formOfferingInfo.fields);

    if (this.props.businessStore.canSubmitOfferingInfoXmlForm) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('offeringInformation')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formOfferingInfo.meta.isDirty = false;
          Helper.toast('Offering information submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while saving offering information, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  }

  handleAnnualSubmit = (currentStepName, nextTabName) => {
    const { formAnnualInfo } = this.props.businessStore;
    businessActions.validateAnnualReportInfo(formAnnualInfo.fields);

    if (this.props.businessStore.canSubmitAnnualReportXmlForm) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('annualReport')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formAnnualInfo.meta.isDirty = false;
          Helper.toast('Annual report disclosure requirements submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while saving Annual report disclosure requirements, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  }

  handleSignatureSubmit = (currentStepName, nextTabName) => {
    const { formSignatureInfo } = this.props.businessStore;
    businessActions.validateSignatureInfo(formSignatureInfo.fields);

    if (this.props.businessStore.canSubmitSigntureForm &&
      !_.includes(this.props.businessStore.canSubmitSignaturePersonsForm, false)) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('signature')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formSignatureInfo.meta.isDirty = false;
          Helper.toast('Signature information submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while saving signature information, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  }

  handleFileSelectorSubmit = (currentStepName, nextTabName) => {
    const { formDocumentInfo } = this.props.businessStore;
    businessActions.validateDocumentList(formDocumentInfo.documentList);
    if (this.props.businessStore.xmlErrors
      && this.props.businessStore.xmlErrors.documentListError === undefined) {
      this.addAndRemoveErrorClass(currentStepName, '');
      businessActions.submitXMLInformation('documentList')
        .then((data) => {
          this.updateBusinessStore({
            currentStepName,
            nextTabName,
            data,
          });
          this.props.businessStore.formDocumentInfo.meta.isDirty = false;
          Helper.toast('Document selection submitted successfully', 'success');
        })
        .catch((err) => {
          if (err) {
            Helper.toast(
              'Something went wrong while document selection, Please try again.',
              'error',
              { position: 'top-center' },
            );
          }
        });
    } else {
      this.addAndRemoveErrorClass(currentStepName, 'tab-error');
    }
  }

  handleXmlSubmissionSubmit = () => {
    businessActions.submitXMLInformation('xmlSubmission')
      .then(() => {
        this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
        Helper.toast('XML form submitted successfully', 'success');
      })
      .catch((errors) => {
        this.props.businessStore.setXmlError(errors);
      });
  }

  handleXmlSubmissionCopy = () => {
    this.props.uiStore.setProgress();
    this.props.uiStore.setLoaderMessage('Copy the XML submission');

    businessActions.copyXMLInformation()
      .then(() => {
        this.props.history.push(`/app/edgar/${this.props.match.params.businessId}`);
        Helper.toast('Copy XML submission successfully', 'success');
      })
      .catch((error) => {
        if (error) {
          Helper.toast(
            'Something went wrong while Copy XML submission, Please try again.',
            'error',
            { position: 'top-center' },
          );
        }
      });
  };

  checkStepWiseStatus = (xmlActiveTabName) => {
    let saveButtonStatus = false;
    if (xmlActiveTabName === 'filer') {
      saveButtonStatus = !this.props.businessStore.formFilerInfo.meta.isValid;
    } else if (xmlActiveTabName === 'issuer') {
      saveButtonStatus = !this.props.businessStore.formIssuerInfo.meta.isValid;
    } else if (xmlActiveTabName === 'offering') {
      saveButtonStatus = !this.props.businessStore.formOfferingInfo.meta.isValid;
    } else if (xmlActiveTabName === 'annual') {
      saveButtonStatus = !this.props.businessStore.formAnnualInfo.meta.isValid;
    } else if (xmlActiveTabName === 'signature') {
      saveButtonStatus = (!this.props.businessStore.formSignatureInfo.meta.isValid
        || this.props.businessStore.formSignatureInfo.fields.signaturePersons.length === 0);
    } else if (xmlActiveTabName === 'doc') {
      const documents = _.filter(this.props.businessStore.formDocumentInfo.documentList, document =>
        document.checked === true);
      saveButtonStatus = (documents.length === 0);
      if (documents.length === 0) {
        this.props.businessStore.formDocumentInfo.meta.isDirty = false;
      }
    }

    return saveButtonStatus;
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
                <Header as="h1">
                  <Link to={`/app/edgar/${this.props.match.params.businessId}`} className="back-link"><Icon name="ns-arrow-left" /></Link>
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
                      disabled={this.checkStepWiseStatus(xmlActiveTabName)}
                      onClick={() => this.handleValidationToActiveTab(xmlActiveTabName)}
                    >
                      Save
                    </Button>
                  }
                </Header>
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
            <FormErrors xmlErrors={xmlErrors} className="field-error-message" />
          </Grid>
        </div>
      </div>
    );
  }
}
