import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Grid } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';
import businessActions from '../../../actions/business';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    businessActions.getBusinessDetails(this.props.match.params.businessId);
  }
  handleAccordionTitleClick = (e, { dataid }) => uiActions.setOpenAccordion(dataid);

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
                  <div className="actions inline">
                    <Link to="/app/business"><Icon name="write" size="small" /></Link>
                    <Link to="" className="danger"><Icon name="trash" /></Link>
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
          />
        </div>
      </div>
    );
  }
}
