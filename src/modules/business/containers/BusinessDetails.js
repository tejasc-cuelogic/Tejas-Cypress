import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Grid, Button, Confirm } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
    this.props.uiStore.toggleConfirmBox(false);
  }

  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

  handleBusinessDelete = () => {
    const businessid = this.props.match.params.businessId;
    businessActions.deleteBusiness(businessid)
      .then(() => this.props.history.push('/app/business'));
  }

  handleDelCancel = () => this.props.uiStore.toggleConfirmBox(false);

  confirmDelete = () => this.props.uiStore.toggleConfirmBox(true);

  render() {
    const { business } = this.props.businessStore;
    return (
      <div>
        <div className="page-header-section webcontent-spacer">
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>
                  <Link to="/app/business" className="back-link"><Icon name="long arrow left" /></Link>
                  {business.name.value}
                  <div className="actions">
                    {/* <Link to="/app/business"><Icon name="write" size="small" /></Link>
                    <Link to="" className="danger"><Icon name="trash" /></Link> */}
                    <Button
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
                    />
                  </div>
                </h3>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
        <div className="content-spacer">
          <p>{business.desc}</p>
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
