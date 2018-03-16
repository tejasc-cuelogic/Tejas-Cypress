import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button, Grid, Confirm } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';
import NewBusinessForm from '../containers/NewBusinessForm';
import Spinner from '../../../theme/ui/Spinner';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
    this.props.uiStore.toggleConfirmBox(false);
  }

  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleBusinessDelete = () => {
    businessActions.deleteBusiness(this.props.match.params.businessId)
      .then(() => this.props.history.push('/app/business'));
  }

  handleOpenModal = () => {
    this.props.businessStore.setEditBusinessMode(true);
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus(true);
  }

  handleDelCancel = () => this.props.uiStore.toggleConfirmBox(false);

  confirmDelete = () => this.props.uiStore.toggleConfirmBox(true);

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
                      content="Are you sure you want to delete business and its associated data?"
                      open={this.props.uiStore.confirmBox}
                      onCancel={this.handleDelCancel}
                      onConfirm={this.handleBusinessDelete}
                      size="tiny"
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
          />
        </div>
      </div>
    );
  }
}
