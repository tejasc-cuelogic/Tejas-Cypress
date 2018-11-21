import React from 'react';
import Aux from 'react-aux';
import { Header } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import find from 'lodash/find';

const AccTypeDescription = observer((props) => {
  const { value, values } = props.accTypes;
  const isAccExist = find(values, v => v.value === value);
  return (
    <div className="option-details">
      { /* Individual */ }
      {isAccExist && value === 0 &&
        <Aux>
          <p>
            Open a NextSeed investment account to begin investing in local businesses.<br /><br />
            An initial deposit can be quickly and securely completed by linking your checking
            account. You can easily connect your account by logging in through our secure system
            or by manually entering your account information. The uninvested cash in your account
            is FDIC-insured up to $250,000 and is interest-bearing.
          </p>
          <p>We safeguard your information with bank-level security measures.</p>
          <p>
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA
            GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for
            uninvested cash in NextSeed accounts.
          </p>
          <p className="grey-text">
            NextSeed accounts are provided and held at our partner bank, Happy State Bank DBA
            GoldStar Trust Company ({'"'}GoldStar{'"'}), which provides FDIC insurance for
            uninvested cash in NextSeed accounts.
          </p>
        </Aux>
      }
      { /* IRA */ }
      {isAccExist && value === 1 &&
        <Aux>
          <div className="promitional-offer-block center-align mb-20 bg-offwhite">
            <Header as="h5">Promotional Offer</Header>
            <p>
              For new NextSeed IRA accounts, NextSeed will cover the one-time setup fee and
              annual account fees for four years. See the{' '}
              <Link to="/agreements/terms-of-use" className="link">Terms and Conditions</Link>
              {' '}for full details.
            </p>
          </div>
          <p>
            Open a self-directed NextSeed IRA to begin investing in local businesses.
            Get the benefits of investing with either a Traditional or Roth IRA.
            Minimum opening deposit: $5,000.   Investment limits apply.
          </p>
          <p>
            The uninvested cash in your account is FDIC-insured up to $250,000 and is
            interest-bearing. We safeguard your information with bank-level security measures.
            <br />Questions? Please see our{' '}
            <Link to="/app/resources/faq" className="link">FAQs on IRAs</Link>.
          </p>
          <p className="grey-text">
            NextSeed is not a tax, investment or legal advisor and does not provide any tax,
            investment, or legal advice; please consult your own advisors or IRS guidelines to
            determine whether investing in NextSeed offerings through a self-directed IRA is
            right for you.
          </p>
        </Aux>
      }
      { /* Entity */ }
      {isAccExist && value === 2 &&
        <Aux>
          <p>
            Invest in businesses through an Entity investment account. (Note: Investment limits
            for Entity accounts are treated separately from Individual investment accounts)
          </p>
          <p>
            An initial deposit can be quickly and securely completed by linking your entity
            checking account. You can easily connect your account by logging in through our
            secure system or by manually entering your account information.
          </p>
          <p>
            The uninvested cash in your account is FDIC-insured up to $250,000 and is
            interest-bearing. We safeguard your information with bank-level security measures.
          </p>
          <p className="grey-text">
            NextSeed is not a tax, investment or legal advisor and does not provide any tax,
            investment, or legal advice; please consult your own advisors or IRS guidelines to
            determine whether investing in NextSeed offerings through a self-directed IRA is
            right for you.
          </p>
        </Aux>
      }
    </div>
  );
});

export default AccTypeDescription;
