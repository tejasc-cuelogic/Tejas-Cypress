import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button, Grid } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';
import NewBusinessForm from '../containers/NewBusinessForm';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
  }

  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleEditBusinessName = () => {
    this.props.businessStore.setEditBusinessName(true);
  }

  handleBusinessDelete = (e, { businessid }) => {
    businessActions.deleteBusiness(businessid)
      .then(() => this.props.history.push('/app/business'));
  }

  handleOpenModal = () => {
    this.props.businessStore.setBusinessMode(true);
    this.props.businessStore.resetNewOfferingInfo();
    this.props.uiStore.setModalStatus(true);
  }

  render() {
    const { business } = this.props.businessStore;

    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>
                  <NewBusinessForm />
                  <Link to="/app/business" className="back-link"><Icon name="long arrow left" /></Link>
                  {business.name.value}
                  <div className="actions">
                    {/* <Link to="/app/business"><Icon name="write" size="small" /></Link>
                    <Link to="" className="danger"><Icon name="trash" /></Link> */}
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
                      onClick={this.handleBusinessDelete}
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </h3>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <p>{business.desc.value}</p>
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
