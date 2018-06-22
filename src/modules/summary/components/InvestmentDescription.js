import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';

const InvestmentDescription = observer((props) => {
  const { value } = props.accTypes;
  return (
    <div className="option-details center-align">
      { /* Individual */ }
      {value === 0 &&
        <p>Open a NextSeed investment account to begin investing in local businesses.
          <br />
        An initial deposit can be quickly and securely completed by linking your checking account.
        You can easily connect your account by logging in through our secure system or by
        manually entering your account information. The uninvested cash in your account is
        [FDIC-insured][note: hover over with footnote] up to $250,000 and is interest-bearing.
          <br />
        We safeguard your information with bank-level security measures.
        </p>
      }
      { /* IRA */ }
      {value === 1 &&
      <p>
        Open a self-directed NextSeed IRA to begin investing in local businesses.
        (Traditional and Roth IRA options available.) Minimum opening deposit: $5,000.
        Investment limits apply.<br />
        <b>Promotional Offer:</b> For new NextSeed IRA accounts,
        NextSeed will cover the  one-time setup fee and
        annual account fees for four years.<br />
        See the <Link to="/app/summary" className="link">Terms and Conditions</Link> for full details.<br />
        <br /><br />
        Questions? Please see our <Link to="/app/summary" className="link">FAQs on IRAs</Link>
      </p>}
      { /* Entity */ }
      {value === 2 &&
      <p>
        Invest in local businesses through an Entity investment account.
        (Note: Investment limits for Entity
        accounts are treated separately from Individual investment accounts)<br />
        An initial deposit can be quickly and securely completed by
        linking your entity checking account. You can<br />
        easily connect your account by logging in through our secure system or
        by manually entering your<br />
        account information.<br />
        The uninvested cash in your account is [FDIC-insured]
        [note: hover over with footnote] up to $250,000<br />
        and is interest-bearing. We safeguard your information with bank-level security measures.
      </p>}
    </div>
  );
});

export default InvestmentDescription;
