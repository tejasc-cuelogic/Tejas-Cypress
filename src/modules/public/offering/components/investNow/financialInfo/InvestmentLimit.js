import React from 'react';
import Aux from 'react-aux';
import { Link } from 'react-router-dom';
import { Header, Popup, Icon } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';

const InvestmentLimit = props => (
  <Aux>
    <Header as={props.changeInvest ? 'h6' : 'h4'} textAlign={props.changeInvest ? '' : 'center'}>
      Your investment limit: {Helper.MoneyMathDisplayCurrency(props.getCurrentLimitForAccount || 0)}
      <Popup
        wide
        trigger={<Icon className="ns-help-circle" color="green" />}
        content={(
          <span>
            Under Regulation Crowdfunding, you have a limit as to how much you may invest
            in Reg CF offerings over a 12-month period. This limit is calculated based on your
            annual income and net worth. <Link to={`${props.refLink}/investment-details/#total-payment-calculator`}>Click here</Link> for how this is calculated. If you believe
            your limit is innacurate, please update your <Link to="/app/profile-settings/profile-data">Investor Profile</Link>
          </span>
          )}
        position="top center"
        hoverable
      />
      <Link to={props.changeInvest ? 'change-investment-limit' : `${props.match.url}/change-investment-limit`} className="link"><small>Update</small></Link>
    </Header>
    {props.changeInvest ?
      <p>Your investment will be {props.diffLimitAmount > 0 ? 'increased' : 'decreased'} by <span className="negative-text">{Helper.CurrencyFormat(props.diffLimitAmount || 0)}</span></p>
    : null
    }
  </Aux>
);

export default InvestmentLimit;
