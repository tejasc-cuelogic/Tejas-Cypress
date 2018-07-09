import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import find from 'lodash/find';

const InvestmentDescription = observer((props) => {
  const { value, values } = props.accTypes;
  const isAccExist = find(values, v => v.value === value);
  return (
    <div className="option-details">
      { /* Individual */ }
      {isAccExist && value === 0 &&
        <p>
          Open a NextSeed investment account to begin investing in local businesses.<br /><br />
          An initial deposit can be quickly and securely completed by linking your checking account.
          You can easily connect your account by logging in through our secure system or by manually
          entering your account information. The uninvested cash in your account is [FDIC-insured]
          [note: hover over with footnote] up to $250,000 and is interest-bearing.<br /><br />
          We safeguard your information with bank-level security measures.
        </p>
      }
      { /* IRA */ }
      {isAccExist && value === 1 &&
      <p>
        Open a self-directed NextSeed IRA to begin investing in local businesses. (Traditional and
        Roth IRA options available.) Minimum opening deposit: $5,000. Investment limits apply.
        <br /><br />
        <b>Promotional Offer:</b> For new NextSeed IRA accounts, NextSeed will cover the one-time
        setup fee and annual account fees for four years.<br /><br />
        See the <Link to="/app/summary" className="link"><b>Terms and Conditions</b></Link> for full details.<br /><br />
        Questions? Please see our <Link to="/app/summary" className="link"><b>FAQs on IRAs</b></Link>
      </p>}
      { /* Entity */ }
      {isAccExist && value === 2 &&
      <p>
        Invest in local businesses through an Entity investment account. (Note: Investment limits
        for Entity accounts are treated separately from Individual investment accounts)<br /><br />
        An initial deposit can be quickly and securely completed by linking your entity checking
        account. You can easily connect your account by logging in through our secure system or
        by manually entering your account information.<br /><br />
        The uninvested cash in your account is [FDIC-insured] [note: hover over with footnote]
        up to $250,000 and is interest-bearing. We safeguard your information with bank-level
        security measures.
      </p>}
    </div>
  );
});

export default InvestmentDescription;
