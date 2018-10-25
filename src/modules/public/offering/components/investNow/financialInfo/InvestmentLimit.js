import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Popup, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const InvestmentLimit = props => (
  <Aux>
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
    <p>Your investment will be decreased by - <span className="negative-text">$12,000</span></p>
  </Aux>
);

export default InvestmentLimit;
