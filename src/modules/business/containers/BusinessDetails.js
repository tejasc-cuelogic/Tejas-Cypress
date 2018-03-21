import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button, Grid, Confirm } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';
import NewBusinessForm from '../containers/NewBusinessForm';
import Spinner from '../../../theme/ui/Spinner';
import Helper from '../../../helper/utility';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  constructor() {
    super();
    this.state = {
      filingId: '',
      xmlSubmissionId: '',
    };
  }

  componentDidMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
    this.props.uiStore.toggleConfirmBox(false);
  }

  componentWillUnmount() {
    this.props.uiStore.reset();
  }

  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleBusinessDelete = () => {
    businessActions.deleteBusiness(this.props.match.params.businessId)
      .then(() => {
        this.props.history.push('/app/business');
        Helper.toast('Business deleted successfully', 'success');
      });
  }

  handleXMlSubmissionDelete = (e, { filingid, xmlsubmissionid }) => {
    businessActions.deleteXmlSubmission(filingid, xmlsubmissionid).then(() => {
      this.props.uiStore.toggleConfirmBoxDuplicated(false);
      this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
      Helper.toast('XML Submission deleted successfully', 'success');
    });
  }

  handleFilingDelete = (e, { filingid }) => {
    businessActions.deleteFiling(this.props.match.params.businessId, filingid).then(() => {
      this.props.uiStore.toggleConfirmBoxDuplicatedAgain(false);
      this.props.history.push(`/app/business/${this.props.match.params.businessId}`);
      Helper.toast('Filing deleted successfully', 'success');
    });
  }

  handleOpenModal = () => {
    this.props.businessStore.setEditBusinessMode(true);
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus(true);
  }

  handleDelCancel = () => this.props.uiStore.toggleConfirmBox(false);

  confirmDelete = () => this.props.uiStore.toggleConfirmBox(true);

  confirmDeleteForDuplicated = (e, { filingid, xmlsubmissionid }) => {
    this.setState({
      filingId: filingid,
      xmlSubmissionId: xmlsubmissionid,
    });
    this.props.uiStore.toggleConfirmBoxDuplicated(true);
  }

  handleDelCancelDuplicated = () => {
    this.setState({
      filingId: '',
      xmlSubmissionId: '',
    });
    this.props.uiStore.toggleConfirmBoxDuplicated(false);
  }

  confirmDeleteForDuplicatedAgain = (e, { filingid }) => {
    this.setState({
      filingId: filingid,
    });
    this.props.uiStore.toggleConfirmBoxDuplicatedAgain(true);
  }

  handleDelCancelDuplicatedAgain = () => {
    this.setState({
      filingId: '',
    });
    this.props.uiStore.toggleConfirmBoxDuplicatedAgain(false);
  }

  handleNewFiling = () => this.props.history.push(`/app/business/${this.props.match.params.businessId}/edgar`)

  render() {
    const { business } = this.props.businessStore;
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
                  <Button
                    circular
                    color="green"
                    floated="right"
                    businessid={this.props.match.params.businessId}
                    onClick={this.handleNewFiling}
                  >
                    + Add Filing
                  </Button>
                  <NewBusinessForm businessid={this.props.match.params.businessId} />
                  <Link to="/app/business" className="back-link"><Icon name="long arrow left" /></Link>
                  {business.name.value}
                  <div className="actions">
                    <Button
                      onClick={this.handleOpenModal}
                      icon
                      circular
                      inverted
                      color="green"
                    >
                      <Icon name="write" />
                    </Button>{' '}
                    <Button
                      icon
                      circular
                      inverted
                      color="red"
                      businessid={this.props.match.params.businessId}
                      onClick={this.confirmDelete}
                    >
                      <Icon name="trash" />
                    </Button>
                    <Confirm
                      header="Confirm"
                      content="Are you sure you want to delete business and its associated data?"
                      open={this.props.uiStore.confirmBox}
                      onCancel={this.handleDelCancel}
                      onConfirm={this.handleBusinessDelete}
                      size="tiny"
                      className="deletion"
                    />
                  </div>
                </h1>
                <p>{business.desc.value}</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <FillingsList
            filings={business.filings}
            handleAccordionClick={this.handleAccordionTitleClick}
            openAccordion={this.props.uiStore.openAccordion}
            businessId={this.props.match.params.businessId}
            confirmDeleteForDuplicated={this.confirmDeleteForDuplicated}
            confirmBoxDuplicated={this.props.uiStore.confirmBoxDuplicated}
            handleDelCancelDuplicated={this.handleDelCancelDuplicated}
            handleXMlSubmissionDelete={this.handleXMlSubmissionDelete}
            confirmDeleteForDuplicatedAgain={this.confirmDeleteForDuplicatedAgain}
            confirmBoxDuplicatedAgain={this.props.uiStore.confirmBoxDuplicatedAgain}
            handleDelCancelDuplicatedAgain={this.handleDelCancelDuplicatedAgain}
            handleFilingDelete={this.handleFilingDelete}
            filingIdToBeDeleted={this.state.filingId}
            xmlSubmissionIdToBeDeleted={this.state.xmlSubmissionId}
          />
        </div>
      </div>
    );
  }
}
