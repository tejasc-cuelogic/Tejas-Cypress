import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';
import uiActions from '../../../actions/ui';

@inject('businessStore', 'uiStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    // TODO: Make Api Call to fetch business details
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
          {business.name} <Icon name="write" size="small" />
          <Button><Icon name="trash" /></Button>
        </h1>
        <p>{business.desc}</p>
        <FillingsList
          fillings={business.fillings}
          handleAccordionClick={this.handleAccordionTitleClick}
          openAccordion={this.props.uiStore.openAccordion}
        />
      </div>
    );
  }
}
