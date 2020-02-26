import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import Helper from '../../../../../../helper/utility';
import { PopUpModal } from '../../../../../../theme/shared';

const isMobile = document.documentElement.clientWidth < 768;

const InvestmentLimit = props => (
  <>
    <Header as={props.changeInvest ? 'h6' : 'h4'} textAlign={props.changeInvest ? '' : 'center'}>
      Your{' '}
      <PopUpModal
        wide
        customTrigger={<span className="popup-label">investment limit</span>}
        content={(
          <span>
            Under Regulation Crowdfunding, you have a limit as to how much you may invest
            in Reg CF offerings over a 12-month period. This limit is calculated based on your
            annual income and net worth. <Link to={`${props.refLink}/investment-details/#total-payment-calculator`}>Click here</Link> for how this is calculated. If you believe
            your limit is inaccurate, please update your <Link to="/dashboard/account-settings/profile-data">Investor Profile</Link>
          </span>
        )}
        position="top center"
        showOnlyPopup={!isMobile}
        hoverable
      />
      :{' '}
      {Helper.MoneyMathDisplayCurrency(props.getCurrentLimitForAccount || 0, false)}
      <Link to={props.changeInvest ? 'change-investment-limit' : `${props.match.url}/change-investment-limit`} className="link"><small>Update</small></Link>
    </Header>
    {props.changeInvest
      ? <p>Your investment will be {props.diffLimitAmount > 0 ? 'increased' : 'decreased'} by <span className="negative-text">{Helper.CurrencyFormat(props.diffLimitAmount || 0, 0)}</span></p>
      : null
    }
  </>
);

export default InvestmentLimit;
