import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

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
        <Link to="/app/business">
          <Icon name="arrow left" size="large" />
        </Link>
        <h1>
          {business.name.value} <Icon name="write" size="small" />
          <Button><Icon name="trash" /></Button>
        </h1>
        <p>{business.desc}</p>
        <FillingsList
          filings={business.filings}
          handleAccordionClick={this.handleAccordionTitleClick}
          openAccordion={this.props.uiStore.openAccordion}
        />
      </div>
    );
  }
}
