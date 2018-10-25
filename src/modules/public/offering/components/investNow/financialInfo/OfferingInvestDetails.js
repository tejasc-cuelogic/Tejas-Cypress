import React from 'react';
import { Link } from 'react-router-dom';
import { Header, Popup, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const OfferingInvestDetails = props => (
  <Header as="h4" textAlign="center">
    Your investment limit: {Helper.CurrencyFormat(props.getCurrentLimitForAccount || 0)}
    <Popup
      wide
      trigger={<Icon className="ns-help-circle" color="green" />}
      content="This calculates"
      position="top center"
    />
    <Link to={props.match.url} className="link" onClick={() => props.setStepToBeRendered(4)}><small>Update</small></Link>
  </Header>
);

export default OfferingInvestDetails;
