import React from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

import FillingsList from '../components/FillingsList';

@inject('businessStore')
@observer
export default class BusinessDetails extends React.Component {
  componentWillMount() {
    console.log(this.props.match.params.businessId);
    // TODO: Make Api Call to fetch business details
  }
  // handleBusinessNameChange = () =>
  render() {
    const { business } = this.props.businessStore;
    return (
      <div>
        <Link to="/app/business">
          <Icon name="arrow left" size="large" />
        </Link>
        <Button><Icon name="trash" /></Button>
        <h2>{business.name} <Icon name="write" onClick={console.log('clicked')} /></h2>
        <p>{business.desc}</p>
        <FillingsList fillings={business.fillings} />
      </div>
    );
  }
}
